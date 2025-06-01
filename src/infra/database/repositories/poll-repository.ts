import { inject, injectable } from 'inversify';
import { SERVICES_DI_TYPES } from '@/container/services/di-types';
import { Poll } from '@/domain/models/poll';
import type {
  IPollRepository,
  PollFeedFilters,
} from '@/domain/repositories/poll-repository.interface';

import type { IDatabase } from '@/infra/database/database';
import { PollEntity } from '@/infra/database/models/poll.entity';
import { RedisCache } from '@/infra/cache/redis.cache';

@injectable()
export class PollRepository implements IPollRepository {
  constructor(
    @inject(SERVICES_DI_TYPES.Database)
    private readonly database: IDatabase,
    @inject(SERVICES_DI_TYPES.Cache) private cache: RedisCache
  ) {}

  private readonly CACHE_KEY = 'polls:recent:300';
  private readonly CACHE_TTL = 300; // 5 minutes

  async findPollsForFeed(filters: PollFeedFilters): Promise<Poll[]> {
    const start = performance.now();

    // Check if we need to query database (pagination beyond 300 or no cache)
    const needsDatabaseQuery = filters.offset && filters.offset >= 300;

    let polls: Poll[] = [];

    if (needsDatabaseQuery) {
      // For pagination beyond 300, query database directly
      polls = await this.queryDatabaseForPolls(filters);
    } else {
      // Try to get from cache first
      polls = await this.getPollsFromCache(filters);

      if (polls.length === 0) {
        // Cache miss - populate cache and get polls
        await this.populateCache();
        polls = await this.getPollsFromCache(filters);
      }
    }

    // Filter out polls the user has already voted on
    if (filters.excludeVotedPolls) {
      polls = await this.filterOutVotedPolls(polls, filters.excludeVotedPolls);
    }

    console.log(`Query time: ${performance.now() - start}ms`);
    return polls;
  }

  private async getPollsFromCache(filters: PollFeedFilters): Promise<Poll[]> {
    try {
      const cachedData = await this.cache.redisio.get(this.CACHE_KEY);

      if (!cachedData) {
        return [];
      }

      let polls: Poll[] = JSON.parse(cachedData);

      polls = polls.map(poll => ({
        ...poll,
        createdAt: new Date(poll.createdAt),
      }));

      // Apply tag filtering if specified
      if (filters.tags && filters.tags.length > 0) {
        polls = polls.filter(
          poll =>
            poll.tags && poll.tags.some(tag => filters.tags!.includes(tag))
        );
      }

      // Apply pagination
      const offset = filters.offset || 0;
      const limit = filters.limit || polls.length;

      return polls.slice(offset, offset + limit);
    } catch (error) {
      console.error('Error getting polls from cache:', error);
      return [];
    }
  }

  private async populateCache(): Promise<void> {
    try {
      const repository = this.database.getRepository(PollEntity);

      const entities = await repository
        .createQueryBuilder('poll')
        .orderBy('poll.createdAt', 'DESC')
        .limit(300)
        .getMany();

      const polls = entities.map(entity => this.toDomainModel(entity));

      await this.cache.redisio.setex(
        this.CACHE_KEY,
        this.CACHE_TTL,
        JSON.stringify(polls)
      );
    } catch (error) {
      console.error('Error populating cache:', error);
    }
  }

  private async queryDatabaseForPolls(
    filters: PollFeedFilters
  ): Promise<Poll[]> {
    const repository = this.database.getRepository(PollEntity);

    let query = repository.createQueryBuilder('poll');

    // Filter by tags (polls that have ANY of the specified tags)
    if (filters.tags && filters.tags.length > 0) {
      query = query.where('poll.tags && :tags', { tags: filters.tags });
    }

    // Order by creation date (newest first)
    query = query.orderBy('poll.createdAt', 'DESC');

    // Pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    const entities = await query.getMany();
    return entities.map(entity => this.toDomainModel(entity));
  }

  private async filterOutVotedPolls(
    polls: Poll[],
    userId: string
  ): Promise<Poll[]> {
    try {
      // Get all poll IDs that the user has voted on
      const repository = this.database.getRepository('votes'); // Adjust entity name as needed

      const votedPollIds = await repository
        .createQueryBuilder('vote')
        .select('DISTINCT vote.pollId')
        .where('vote.userId = :userId', { userId })
        .getRawMany();

      const votedIds = new Set(votedPollIds.map(row => row.pollId));

      // Filter out polls the user has voted on
      return polls.filter(poll => !votedIds.has(poll.id));
    } catch (error) {
      console.error('Error filtering voted polls:', error);
      return polls; // Return unfiltered polls on error
    }
  }

  // Optional: Method to manually refresh cache
  async refreshPollsCache(): Promise<void> {
    await this.populateCache();
  }

  // Optional: Method to clear cache
  async clearPollsCache(): Promise<void> {
    await this.cache.redisio.del(this.CACHE_KEY);
  }
  async countPollsForFeed(filters: PollFeedFilters): Promise<number> {
    const repository = this.database.getRepository(PollEntity);

    let query = repository.createQueryBuilder('poll');

    // Apply same filters as findPollsForFeed but return count
    if (filters.tags && filters.tags.length > 0) {
      query = query.where('poll.tags && :tags', { tags: filters.tags });
    }

    if (filters.excludeUserPolls) {
      query = query.andWhere('poll.creatorId != :creatorId', {
        creatorId: filters.excludeUserPolls,
      });
    }

    if (filters.excludeVotedPolls) {
      query = query.andWhere(
        `
        poll.id NOT IN (
          SELECT DISTINCT vote.pollId
          FROM votes vote
          WHERE vote.userId = :userId
        )
      `,
        { userId: filters.excludeVotedPolls }
      );
    }

    return await query.getCount();
  }

  async findById(id: string): Promise<Poll | null> {
    const repository = this.database.getRepository(PollEntity);

    const pollEntity = await repository.findOne({ where: { id: id } });

    if (pollEntity) {
      return this.toDomainModel(pollEntity);
    }
    return null;
  }

  async save(poll: Poll): Promise<void> {
    const repository = this.database.getRepository(PollEntity);

    const entity = new PollEntity();
    entity.title = poll.title;
    entity.options = poll.options;
    entity.tags = poll.tags;

    await repository.save(entity);
  }

  private toDomainModel(entity: PollEntity): Poll {
    return new Poll({
      id: entity.id,
      title: entity.title,
      options: entity.options,
      tags: entity.tags,
      createdAt: entity.createdAt,
    });
  }
}
