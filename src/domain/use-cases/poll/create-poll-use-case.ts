import { inject, injectable } from 'inversify';

import { CORE_DI_TYPES } from '@/container/core/di-types';
import { REPOSITORIES_DI_TYPES } from '@/container/repositories/di-types';
import type { IIDGenerator } from '@/core/id/id-generator.interface';
import { Failure, Success } from '@/core/result/result';
import type { ITime } from '@/core/time/time.interface';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import type { IPollRepository } from '@/domain/repositories/poll-repository.interface';
import { Poll } from '@/domain/models/poll';

export type CreatePollUseCasePayload = {
  title: string;
  options: string[];
  tags?: string[];
};

type CreatePollUseCaseFailureReason =
  | 'TooFewOptions'
  | 'EmptyTitle'
  | 'InvalidTagsFormat'
  | 'UnknownError';

export type CreatePollUseCaseFailure = {
  reason: CreatePollUseCaseFailureReason;
  error: Error;
};

export type CreatePollUseCaseSuccess = {
  poll: Poll;
};

@injectable()
export class CreatePollUseCase
  implements
    IUseCase<
      CreatePollUseCasePayload,
      CreatePollUseCaseSuccess,
      CreatePollUseCaseFailure
    >
{
  constructor(
    @inject(CORE_DI_TYPES.IDGenerator)
    private readonly idGenerator: IIDGenerator,
    @inject(CORE_DI_TYPES.Time)
    private readonly time: ITime,
    @inject(REPOSITORIES_DI_TYPES.PollRepository)
    private readonly pollRepository: IPollRepository
  ) {}

  async execute(payload: CreatePollUseCasePayload) {
    try {
      if (!payload.title.trim()) {
        return new Failure<CreatePollUseCaseFailure>({
          reason: 'EmptyTitle',
          error: new Error('Title cannot be empty'),
        });
      }

      if (payload.options.length < 2) {
        return new Failure<CreatePollUseCaseFailure>({
          reason: 'TooFewOptions',
          error: new Error('Poll must have at least 2 options'),
        });
      }

      if (
        payload.tags &&
        (!Array.isArray(payload.tags) ||
          payload.tags.some(tag => typeof tag !== 'string'))
      ) {
        return new Failure<CreatePollUseCaseFailure>({
          reason: 'InvalidTagsFormat',
          error: new Error('Tags must be an array of strings'),
        });
      }

      const poll = new Poll({
        id: this.idGenerator.generate(),
        title: payload.title,
        options: payload.options,
        tags: payload.tags ?? [],
        createdAt: this.time.now(),
      });

      await this.pollRepository.save(poll);

      return new Success({ poll });
    } catch (error) {
      return new Failure<CreatePollUseCaseFailure>({
        reason: 'UnknownError',
        error: error as Error,
      });
    }
  }
}
