import { inject, injectable } from 'inversify';

import { REPOSITORIES_DI_TYPES } from '@/container/repositories/di-types';
import { Failure, Success } from '@/core/result/result';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import type {
  IPollRepository,
  PollFeedFilters,
} from '@/domain/repositories/poll-repository.interface';
import { Poll } from '@/domain/models/poll';

type GetPollFeedUseCaseFailureReason = 'UnknownError';

export type GetPollFeedUseCaseFailure = {
  reason: GetPollFeedUseCaseFailureReason;
  error: Error;
};

export interface GetPollFeedParams {
  tags?: string[];
  limit?: number;
  offset?: number;
  userId?: string; // For personalization
}

export interface GetPollFeedResult {
  polls: Poll[];
  hasMore: boolean;
  totalCount: number;
}

@injectable()
export class GetPollFeedUseCase
  implements
    IUseCase<GetPollFeedParams, GetPollFeedResult, GetPollFeedUseCaseFailure>
{
  constructor(
    @inject(REPOSITORIES_DI_TYPES.PollRepository)
    private readonly pollRepository: IPollRepository
  ) {}

  async execute(params: GetPollFeedParams) {
    try {
      // Business Rules:
      // 1. Default limit is 10, max is 50
      // 2. Filter by tags if provided
      // 3. Exclude user's own polls if userId provided
      // 4. Exclude polls user already voted on if userId provided
      // 5. Order by creation date (newest first)

      const limit = Math.min(params.limit || 10, 50);
      const offset = params.offset || 0;

      // Validate tags format
      if (params.tags) {
        const invalidTags = params.tags.filter(
          tag => typeof tag !== 'string' || tag.trim().length === 0
        );
        if (invalidTags.length > 0) {
          throw new Error('Invalid tag format provided');
        }
      }

      // Get user's voted poll IDs to exclude them
      let votedPollIds: string[] = [];
      if (params.userId) {
        // votedPollIds = await this.voteRepository.getUserVotedPollIds(
        //   request.userId
        // );
      }

      // Build filters
      const filters: PollFeedFilters = {
        tags: params.tags,
        limit: limit + 1, // Get one extra to check if there are more
        offset,
        excludeUserPolls: params.userId,
        excludeVotedPolls: params.userId,
      };

      // Get polls from repository
      const polls = await this.pollRepository.findPollsForFeed(filters);

      // Check if there are more polls
      const hasMore = polls.length > limit;
      const resultPolls = hasMore ? polls.slice(0, limit) : polls;

      // Get total count for pagination info (optional)
      // Note: This could be expensive for large datasets, consider caching
      // const totalCount = await this.pollRepository.countPollsForFeed({
      //   ...filters,
      //   limit: undefined, // Remove limit for count
      //   offset: undefined,
      // });
      const totalCount = -1;
      return new Success({
        polls: resultPolls,
        hasMore,
        totalCount,
      });
    } catch (error) {
      return new Failure<GetPollFeedUseCaseFailure>({
        reason: 'UnknownError',
        error: error as Error,
      });
    }
  }
}
