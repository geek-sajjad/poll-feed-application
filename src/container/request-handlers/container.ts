import { LoginRequestHandler } from '@/app/request-handlers/auth/commands/login-request-handler';
import { AuthenticatedRequestHandler } from '@/app/request-handlers/auth/queries/authenticated-request-handler';
import { HealthRequestHandler } from '@/app/request-handlers/health/queries/health-request-handler';
import { CreatePollRequestHandler } from '@/app/request-handlers/poll/create-poll-request.handler';
import { GetPollFeedRequestHandler } from '@/app/request-handlers/poll/get-poll-feed-request.handler';
import { SkipOnPollRequestHandler } from '@/app/request-handlers/poll/skip-on-poll-request.handler';
import { StatsPollRequestHandler } from '@/app/request-handlers/poll/stats-poll-request.handler';
import { VoteOnPollRequestHandler } from '@/app/request-handlers/poll/vote-on-poll-request.handler';
import type { IRequestHandler } from '@/app/request-handlers/request-handler.interface';
import { CreateUserRequestHandler } from '@/app/request-handlers/users/commands/create-user-request-handler';
import type { ContainerBuilder } from '@/container/container';
import { REQUEST_HANDLERS_DI_TYPES } from '@/container/request-handlers/di-types';

export const registerRequestHandlers = (containerBuilder: ContainerBuilder) => {
  const builder = new RequestHandlersContainerBuilder(
    containerBuilder
  ).registerRequestHandlers();

  return builder;
};

/**
 * This class is used to register all the request handlers in the container
 */
class RequestHandlersContainerBuilder {
  constructor(private readonly containerBuilder: ContainerBuilder) {}

  registerRequestHandlers() {
    this.registerAuthRequestHandlers()
      .registerUsersRequestHandlers()
      .registerHealthRequestHandlers()
      .registerPollRequestHandlers()
      .registerSkipOnPollRequestHandlers()
      .registerVoteOnPollRequestHandlers()
      .registerStatsPollRequestHandler()
      .registerGetPollFeedRequestHandlers();

    return this.containerBuilder;
  }

  private registerAuthRequestHandlers() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IRequestHandler>(REQUEST_HANDLERS_DI_TYPES.LoginRequestHandler)
        .to(LoginRequestHandler)
        .inSingletonScope();
    });
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IRequestHandler>(
          REQUEST_HANDLERS_DI_TYPES.AuthenticatedRequestHandler
        )
        .to(AuthenticatedRequestHandler)
        .inSingletonScope();
    });

    return this;
  }

  private registerUsersRequestHandlers() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IRequestHandler>(
          REQUEST_HANDLERS_DI_TYPES.CreateUserRequestHandler
        )
        .to(CreateUserRequestHandler)
        .inSingletonScope();
    });

    return this;
  }

  private registerHealthRequestHandlers() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IRequestHandler>(REQUEST_HANDLERS_DI_TYPES.HealthRequestHandler)
        .to(HealthRequestHandler)
        .inSingletonScope();
    });

    return this;
  }

  private registerPollRequestHandlers() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IRequestHandler>(
          REQUEST_HANDLERS_DI_TYPES.CreatePollRequestHandler
        )
        .to(CreatePollRequestHandler)
        .inSingletonScope();
    });

    return this;
  }
  private registerGetPollFeedRequestHandlers() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IRequestHandler>(REQUEST_HANDLERS_DI_TYPES.GetPollRequestHandler)
        .to(GetPollFeedRequestHandler)
        .inSingletonScope();
    });

    return this;
  }

  private registerVoteOnPollRequestHandlers() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IRequestHandler>(
          REQUEST_HANDLERS_DI_TYPES.VoteOnPollRequestHandler
        )
        .to(VoteOnPollRequestHandler)
        .inSingletonScope();
    });

    return this;
  }

  private registerSkipOnPollRequestHandlers() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IRequestHandler>(
          REQUEST_HANDLERS_DI_TYPES.SkipOnPollRequestHandler
        )
        .to(SkipOnPollRequestHandler)
        .inSingletonScope();
    });

    return this;
  }

  private registerStatsPollRequestHandler() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IRequestHandler>(
          REQUEST_HANDLERS_DI_TYPES.StatsPollRequestHandler
        )
        .to(StatsPollRequestHandler)
        .inSingletonScope();
    });

    return this;
  }
}
