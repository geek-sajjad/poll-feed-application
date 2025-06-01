import { inject, injectable } from 'inversify';
import { z } from 'zod';
import type { Request, Response } from 'express';

import type { IRequestHandler } from '@/app/request-handlers/request-handler.interface';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import type {
  VoteOnPollUseCaseFailure,
  VoteOnPollUseCasePayload,
  VoteOnPollUseCaseSuccess,
} from '@/domain/use-cases/poll/vote-on-use-case';
import { USE_CASES_DI_TYPES } from '@/container/use-cases/di-types';
import { HttpError } from '@/app/http-error';

const payloadSchema = z.object({
  userId: z.string().uuid('Invalid poll ID format'),
  optionIndex: z
    .number()
    .int()
    .min(0, 'Option index must be a non-negative integer'),
});

const paramsSchema = z.object({
  id: z.string().uuid('Invalid poll ID format'),
});

@injectable()
export class VoteOnPollRequestHandler implements IRequestHandler {
  constructor(
    @inject(USE_CASES_DI_TYPES.VoteOnPollUseCase)
    private readonly voteOnPollUseCase: IUseCase<
      VoteOnPollUseCasePayload,
      VoteOnPollUseCaseSuccess,
      VoteOnPollUseCaseFailure
    >
  ) {}

  async handler(req: Request, res: Response) {
    const { id: pollId } = paramsSchema.parse(req.params);
    const { optionIndex, userId } = payloadSchema.parse(req.body);

    const result = await this.voteOnPollUseCase.execute({
      pollId,
      userId,
      optionIndex,
    });

    if (result.isSuccess()) {
      res.status(200).send();
      return;
    } else if (result.isFailure()) {
      const failure = result.failure;

      switch (failure.reason) {
        case 'AlreadyVoted':
          throw HttpError.badRequest('AlreadyVoted');
        case 'DailyVoteLimitExceeded':
          throw HttpError.badRequest('DailyVoteLimitExceeded');
        case 'UnknownError':
          throw failure.error;
        default:
          throw HttpError.internalServerError(
            'An unexpected error occurred',
            failure.error
          );
      }
    }
  }
}
