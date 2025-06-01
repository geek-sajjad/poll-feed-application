import { inject, injectable } from 'inversify';
import { MoreThanOrEqual } from 'typeorm';
import { SERVICES_DI_TYPES } from '@/container/services/di-types';
import type {
  IPollStats,
  IVoteRepository,
} from '@/domain/repositories/vote-repository.interface';
import type { IDatabase } from '@/infra/database/database';
import { VoteEntity } from '@/infra/database/models/vote.entity';
import { Vote } from '@/domain/models/vote';
import { Poll } from '@/domain/models/poll';

@injectable()
export class VoteRepository implements IVoteRepository {
  constructor(
    @inject(SERVICES_DI_TYPES.Database)
    private readonly database: IDatabase
  ) {}

  async findByUserAndPoll(
    userId: string,
    pollId: string
  ): Promise<Vote | null> {
    const repository = this.database.getRepository(VoteEntity);

    const voteEntity = await repository.findOne({
      where: {
        userId,
        pollId,
      },
    });

    return voteEntity ? this.toDomainModel(voteEntity) : null;
  }

  async save(vote: Vote): Promise<void> {
    const repository = this.database.getRepository(VoteEntity);

    // Convert domain model to database entity
    const voteEntity = new VoteEntity();
    voteEntity.userId = vote.userId;
    voteEntity.pollId = vote.pollId;
    voteEntity.optionIndex = vote.optionIndex;
    voteEntity.isSkip = vote.isSkip;
    voteEntity.createdAt = vote.createdAt;

    await repository.save(voteEntity);
  }

  async countUserVotesToday(userId: string): Promise<number> {
    const repository = this.database.getRepository(VoteEntity);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return repository.count({
      where: {
        userId,
        createdAt: MoreThanOrEqual(today),
        isSkip: false,
      },
    });
  }

  async getPollStats(poll: Poll): Promise<IPollStats> {
    const voteRepository = this.database.getRepository(VoteEntity);

    const result = await voteRepository
      .createQueryBuilder('vote')
      .select('vote.optionIndex', 'optionIndex')
      .addSelect('COUNT(*)', 'count')
      .where('vote.pollId = :pollId', { pollId: poll.id })
      .andWhere('vote.isSkip = false')
      .groupBy('vote.optionIndex')
      .orderBy('vote.optionIndex', 'ASC')
      .getRawMany();

    const votes = result.map(row => {
      const optionIndex = parseInt(row.optionIndex);
      const count = parseInt(row.count);
      const option = poll.options[optionIndex] || `Option ${optionIndex + 1}`;

      return {
        option,
        count,
      };
    });

    poll.options.forEach((option: string, index: number) => {
      const hasVotes = votes.some(vote => vote.option === option);
      if (!hasVotes) {
        votes.push({
          option,
          count: 0,
        });
      }
    });

    votes.sort((a, b) => {
      const indexA = poll.options.indexOf(a.option);
      const indexB = poll.options.indexOf(b.option);
      return indexA - indexB;
    });

    return {
      pollId: poll.id,
      votes,
    };
  }

  async findById(id: string): Promise<Vote | null> {
    const repository = this.database.getRepository(VoteEntity);

    const voteEntity = await repository.findOne({
      where: { id },
    });

    return voteEntity ? this.toDomainModel(voteEntity) : null;
  }

  private toDomainModel(voteEntity: VoteEntity): Vote {
    return new Vote({
      isSkip: voteEntity.isSkip,
      optionIndex: voteEntity.optionIndex,
      createdAt: voteEntity.createdAt,
      id: voteEntity.id,
      pollId: voteEntity.pollId,
      userId: voteEntity.userId,
    });
  }
}
