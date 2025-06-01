import { inject, injectable } from 'inversify';

import { CORE_DI_TYPES } from '@/container/core/di-types';
import { REPOSITORIES_DI_TYPES } from '@/container/repositories/di-types';
import type { IIDGenerator } from '@/core/id/id-generator.interface';
import { Failure, Success } from '@/core/result/result';
import type { ITime } from '@/core/time/time.interface';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import type { IVoteRepository } from '@/domain/repositories/vote-repository.interface';
import { Vote } from '@/domain/models/vote';
import { PollId } from '@/domain/models/poll';
import { IPollRepository } from '@/domain/repositories/poll-repository.interface';

export type StatsPollUseCasePayload = {
  pollId: string;
};

type StatsPollUseCaseFailureReason = 'NotFound' | 'UnknownError';

export type StatsPollUseCaseFailure = {
  reason: StatsPollUseCaseFailureReason;
  error: Error;
};

export interface StatsPollResult {
  pollId: PollId;
  votes: {
    option: string;
    count: number;
  }[];
}

@injectable()
export class StatsPollUseCase
  implements
    IUseCase<StatsPollUseCasePayload, StatsPollResult, StatsPollUseCaseFailure>
{
  constructor(
    @inject(REPOSITORIES_DI_TYPES.VoteRepository)
    private readonly voteRepository: IVoteRepository,

    @inject(REPOSITORIES_DI_TYPES.PollRepository)
    private readonly pollRepository: IPollRepository
  ) {}

  async execute(payload: StatsPollUseCasePayload) {
    try {
      // First verify that the poll exists
      const poll = await this.pollRepository.findById(payload.pollId);
      if (!poll) {
        return new Failure<StatsPollUseCaseFailure>({
          reason: 'NotFound',
          error: new Error(`Poll with id ${payload.pollId} not found`),
        });
      }

      // Get the aggregated vote statistics
      const stats = await this.voteRepository.getPollStats(poll);

      return new Success({
        pollId: stats.pollId,
        votes: stats.votes,
      } as StatsPollResult);
    } catch (error) {
      return new Failure<StatsPollUseCaseFailure>({
        reason: 'UnknownError',
        error: error as Error,
      });
    }
  }
}
