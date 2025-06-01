import { inject, injectable } from 'inversify';
import { z } from 'zod';
import type { Request, Response } from 'express';

import type { IRequestHandler } from '@/app/request-handlers/request-handler.interface';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import type {
  StatsPollUseCaseFailure,
  StatsPollUseCasePayload,
  StatsPollResult,
} from '@/domain/use-cases/poll/stats-use-case';
import { USE_CASES_DI_TYPES } from '@/container/use-cases/di-types';
import { HttpError } from '@/app/http-error';

const paramsSchema = z.object({
  id: z.string().uuid('Invalid poll ID format'),
});

@injectable()
export class StatsPollRequestHandler implements IRequestHandler {
  constructor(
    @inject(USE_CASES_DI_TYPES.StatsPollUseCase)
    private readonly statsPollUseCase: IUseCase<
      StatsPollUseCasePayload,
      StatsPollResult,
      StatsPollUseCaseFailure
    >
  ) {}

  async handler(req: Request, res: Response) {
    const { id: pollId } = paramsSchema.parse(req.params);

    const result = await this.statsPollUseCase.execute({
      pollId,
    });

    if (result.isSuccess()) {
      res.status(200).json(result.value);
      return;
    } else if (result.isFailure()) {
      const failure = result.failure;

      switch (failure.reason) {
        case 'NotFound':
          throw HttpError.notFound('NotFound');
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
