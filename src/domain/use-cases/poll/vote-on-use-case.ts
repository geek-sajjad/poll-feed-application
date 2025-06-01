import { inject, injectable } from 'inversify';

import { CORE_DI_TYPES } from '@/container/core/di-types';
import { REPOSITORIES_DI_TYPES } from '@/container/repositories/di-types';
import type { IIDGenerator } from '@/core/id/id-generator.interface';
import { Failure, Success } from '@/core/result/result';
import type { ITime } from '@/core/time/time.interface';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import type { IVoteRepository } from '@/domain/repositories/vote-repository.interface';
import { Vote } from '@/domain/models/vote';

export type VoteOnPollUseCasePayload = {
  userId: string;
  pollId: string;
  optionIndex: number;
};

type VoteOnPollUseCaseFailureReason =
  | 'AlreadyVoted'
  | 'DailyVoteLimitExceeded'
  | 'UnknownError';

export type VoteOnPollUseCaseFailure = {
  reason: VoteOnPollUseCaseFailureReason;
  error: Error;
};

export type VoteOnPollUseCaseSuccess = {
  vote: Vote;
};

@injectable()
export class VoteOnPollUseCase
  implements
    IUseCase<
      VoteOnPollUseCasePayload,
      VoteOnPollUseCaseSuccess,
      VoteOnPollUseCaseFailure
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

  async execute(payload: VoteOnPollUseCasePayload) {
    try {
      const existingVote = await this.voteRepository.findByUserAndPoll(
        payload.userId,
        payload.pollId
      );
      if (existingVote) {
        return new Failure<VoteOnPollUseCaseFailure>({
          reason: 'AlreadyVoted',
          error: new Error('User already voted on this poll'),
        });
      }

      const dailyVotes = await this.voteRepository.countUserVotesToday(
        payload.userId
      );
      if (dailyVotes >= 100) {
        return new Failure<VoteOnPollUseCaseFailure>({
          reason: 'DailyVoteLimitExceeded',
          error: new Error('Daily vote limit exceeded'),
        });
      }

      const vote = new Vote({
        id: this.idGenerator.generate(),
        userId: payload.userId,
        pollId: payload.pollId,
        optionIndex: payload.optionIndex,
        isSkip: false,
        createdAt: this.time.now(),
      });

      await this.voteRepository.save(vote);

      return new Success({ vote });
    } catch (error) {
      return new Failure<VoteOnPollUseCaseFailure>({
        reason: 'UnknownError',
        error: error as Error,
      });
    }
  }
}
