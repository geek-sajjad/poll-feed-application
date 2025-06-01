import { USE_CASES_DI_TYPES } from '@/container/use-cases/di-types';
import { IUseCase } from '@/core/use-case/use-case.interface';
import {
  GetPollFeedParams,
  GetPollFeedResult,
  GetPollFeedUseCaseFailure,
} from '@/domain/use-cases/poll/get-poll-feed-use-case';
import { inject, injectable } from 'inversify';
import { IRequestHandler } from '../request-handler.interface';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '@/app/http-error';
import { z } from 'zod';

export interface GetPollFeedQueryDto {
  tags?: string;
  limit?: string;
  offset?: string;
}
export interface PollFeedResponseDto {
  polls: PollDto[];
  hasMore: boolean;
  totalCount: number;
  pagination: {
    limit: number;
    offset: number;
    currentPage: number;
    totalPages: number;
  };
}
export interface PollDto {
  id: string;
  title: string;
  options: string[];
  tags: string[];
  createdAt: string; // ISO date string
}

const querySchema = z.object({
  tag: z.string().optional(),
  limit: z
    .string()
    .optional()
    .transform(val => (val ? Math.max(1, parseInt(val, 10)) : 10)),
  page: z
    .string()
    .optional()
    .transform(val => (val ? Math.max(0, parseInt(val, 10)) : 0)),
  userId: z.string(),
});

@injectable()
export class GetPollFeedRequestHandler implements IRequestHandler {
  constructor(
    @inject(USE_CASES_DI_TYPES.GetPollFeedUseCase)
    private readonly getPollFeedUseCase: IUseCase<
      GetPollFeedParams,
      GetPollFeedResult,
      GetPollFeedUseCaseFailure
    >
  ) {}

  async handler(req: Request, res: Response) {
    const parsed = querySchema.parse(req.query);
    const tags = parsed.tag
      ? parsed.tag
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean)
      : undefined;

    const { limit, page, userId } = parsed;
    const offset = (page - 1) * limit;

    const result = await this.getPollFeedUseCase.execute({
      tags,
      limit,
      offset,
      userId,
    });

    if (result.isSuccess()) {
      const { polls, hasMore, totalCount } = result.value;

      const response = {
        polls: polls.map(poll => ({
          id: poll.id,
          title: poll.title,
          options: poll.options,
          tags: poll.tags,
          createdAt: poll.createdAt.toISOString(),
        })),
        hasMore,
        totalCount,
        pagination: {
          limit,
          offset,
          currentPage: Math.floor(offset / limit) + 1,
          totalPages: Math.ceil(totalCount / limit),
        },
      };

      res.status(200).json(response);
      return;
    }

    if (result.isFailure()) {
      const failure = result.failure;

      switch (failure.reason) {
        case 'UnknownError':
          throw failure.error;
      }
    }
  }
}
