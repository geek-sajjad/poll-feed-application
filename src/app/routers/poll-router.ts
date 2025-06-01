import { inject, injectable } from 'inversify';
import { BaseRouter } from './base-router';
import { REQUEST_HANDLERS_DI_TYPES } from '@/container/request-handlers/di-types';
import { IRequestHandler } from '../request-handlers/request-handler.interface';

@injectable()
class PollRouter extends BaseRouter {
  constructor(
    @inject(REQUEST_HANDLERS_DI_TYPES.CreatePollRequestHandler)
    private readonly createPollRequestHandler: IRequestHandler,

    @inject(REQUEST_HANDLERS_DI_TYPES.GetPollRequestHandler)
    private readonly getPollFeedRequestHandler: IRequestHandler,

    @inject(REQUEST_HANDLERS_DI_TYPES.VoteOnPollRequestHandler)
    private readonly voteOnPollRequestHandler: IRequestHandler,

    @inject(REQUEST_HANDLERS_DI_TYPES.SkipOnPollRequestHandler)
    private readonly skipOnPollRequestHandler: IRequestHandler,

    @inject(REQUEST_HANDLERS_DI_TYPES.StatsPollRequestHandler)
    private readonly statsPollRequestHandler: IRequestHandler
  ) {
    super();
  }

  setupRoutes(): void {
    this.router
      .route('/')
      .post(
        this.createPollRequestHandler.handler.bind(
          this.createPollRequestHandler
        )
      );

    this.router
      .route('/')
      .get(
        this.getPollFeedRequestHandler.handler.bind(
          this.getPollFeedRequestHandler
        )
      );

    this.router
      .route('/:id/vote')
      .post(
        this.voteOnPollRequestHandler.handler.bind(
          this.voteOnPollRequestHandler
        )
      );

    this.router
      .route('/:id/skip')
      .post(
        this.skipOnPollRequestHandler.handler.bind(
          this.skipOnPollRequestHandler
        )
      );

    this.router
      .route('/:id/stats')
      .get(
        this.statsPollRequestHandler.handler.bind(this.statsPollRequestHandler)
      );
  }
}

export { PollRouter };
