import { inject, injectable } from 'inversify';

import { CORE_DI_TYPES } from '@/container/core/di-types';
import { REPOSITORIES_DI_TYPES } from '@/container/repositories/di-types';
import type { IIDGenerator } from '@/core/id/id-generator.interface';
import { Failure, Success } from '@/core/result/result';
import type { ITime } from '@/core/time/time.interface';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import type { IVoteRepository } from '@/domain/repositories/vote-repository.interface';
import { Vote } from '@/domain/models/vote';

export type SkipOnPollUseCasePayload = {
  userId: string;
  pollId: string;
};

type SkipOnPollUseCaseFailureReason =
  | 'AlreadySkipped'
  | 'DailyVoteLimitExceeded'
  | 'UnknownError';

export type SkipOnPollUseCaseFailure = {
  reason: SkipOnPollUseCaseFailureReason;
  error: Error;
};

export type SkipOnPollUseCaseSuccess = {
  vote: Vote;
};

@injectable()
export class SkipOnPollUseCase
  implements
    IUseCase<
      SkipOnPollUseCasePayload,
      SkipOnPollUseCaseSuccess,
      SkipOnPollUseCaseFailure
    >
{
  constructor(
    @inject(CORE_DI_TYPES.IDGenerator)
    private readonly idGenerator: IIDGenerator,
    @inject(CORE_DI_TYPES.Time)
    private readonly time: ITime,
    @inject(REPOSITORIES_DI_TYPES.VoteRepository)
    private readonly voteRepository: IVoteRepository
  ) {}

  async execute(payload: SkipOnPollUseCasePayload) {
    try {
      const existingVote = await this.voteRepository.findByUserAndPoll(
        payload.userId,
        payload.pollId
      );
      if (existingVote) {
        return new Failure<SkipOnPollUseCaseFailure>({
          reason: 'AlreadySkipped',
          error: new Error('User already voted on this poll'),
        });
      }

      const dailyVotes = await this.voteRepository.countUserVotesToday(
        payload.userId
      );
      if (dailyVotes >= 100) {
        return new Failure<SkipOnPollUseCaseFailure>({
          reason: 'DailyVoteLimitExceeded',
          error: new Error('Daily vote limit exceeded'),
        });
      }

      const vote = new Vote({
        id: this.idGenerator.generate(),
        userId: payload.userId,
        pollId: payload.pollId,
        optionIndex: null,
        isSkip: true,
        createdAt: this.time.now(),
      });

      await this.voteRepository.save(vote);

      return new Success({ vote });
    } catch (error) {
      return new Failure<SkipOnPollUseCaseFailure>({
        reason: 'UnknownError',
        error: error as Error,
      });
    }
  }
}
