import { inject, injectable } from 'inversify';
import { z } from 'zod';
import type { Request, Response } from 'express';

import type { IRequestHandler } from '@/app/request-handlers/request-handler.interface';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import type {
  CreatePollUseCaseFailure,
  CreatePollUseCasePayload,
  CreatePollUseCaseSuccess,
} from '@/domain/use-cases/poll/create-poll-use-case';
import { USE_CASES_DI_TYPES } from '@/container/use-cases/di-types';
import { HttpError } from '@/app/http-error';

const payloadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  options: z.array(z.string().min(1)).min(2, 'At least 2 options required'),
  tags: z.array(z.string()).optional().default([]),
});

@injectable()
export class CreatePollRequestHandler implements IRequestHandler {
  constructor(
    @inject(USE_CASES_DI_TYPES.CreatePollUseCase)
    private readonly createPollUseCase: IUseCase<
      CreatePollUseCasePayload,
      CreatePollUseCaseSuccess,
      CreatePollUseCaseFailure
    >
  ) {}

  async handler(req: Request, res: Response) {
    const { options, tags, title } = payloadSchema.parse(req.body);

    const result = await this.createPollUseCase.execute({
      title,
      options,
      tags,
    });

    if (result.isSuccess()) {
      res.status(201).send();
      return;
    } else if (result.isFailure()) {
      const failure = result.failure;

      switch (failure.reason) {
        case 'EmptyTitle':
          throw HttpError.badRequest('Invalid poll title');
        case 'InvalidTagsFormat':
          throw HttpError.badRequest('Invalid poll tags');
        case 'TooFewOptions':
          throw HttpError.badRequest('TooFewOptions');
        case 'UnknownError':
          throw failure.error;
      }
    }
  }
}
