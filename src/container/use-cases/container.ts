import type { ContainerBuilder } from '@/container/container';
import { USE_CASES_DI_TYPES } from '@/container/use-cases/di-types';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import { GetCurrentUserUseCase } from '@/domain/use-cases/auth/get-current-user-use-case';
import { LoginUseCase } from '@/domain/use-cases/auth/login-use-case';
import { CreatePollUseCase } from '@/domain/use-cases/poll/create-poll-use-case';
import { GetPollFeedUseCase } from '@/domain/use-cases/poll/get-poll-feed-use-case';
import { SkipOnPollUseCase } from '@/domain/use-cases/poll/skip-on-use-case';
import { StatsPollUseCase } from '@/domain/use-cases/poll/stats-use-case';
import { VoteOnPollUseCase } from '@/domain/use-cases/poll/vote-on-use-case';
import { CreateUserUseCase } from '@/domain/use-cases/user/create-user-use-case';

export const registerUseCases = (containerBuilder: ContainerBuilder) => {
  const builder = new UseCasesContainerBuilder(
    containerBuilder
  ).registerUseCases();

  return builder;
};

/**
 * This class is used to register all the use cases in the container
 */
class UseCasesContainerBuilder {
  constructor(private readonly containerBuilder: ContainerBuilder) {}

  registerUseCases() {
    this.registerAuthUseCases()
      .registerUserUseCases()
      .registerPollUseCases()
      .registerSkipOnPollUseCase()
      .registerVoteOnPollUseCase()
      .registerStatsPollUseCase()
      .registerGetPollFeedUseCases();

    return this.containerBuilder;
  }

  private registerAuthUseCases() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IUseCase>(USE_CASES_DI_TYPES.LoginUseCase)
        .to(LoginUseCase)
        .inSingletonScope();
    });

    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IUseCase>(USE_CASES_DI_TYPES.GetCurrentUserUseCase)
        .to(GetCurrentUserUseCase)
        .inSingletonScope();
    });

    return this;
  }

  private registerUserUseCases() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IUseCase>(USE_CASES_DI_TYPES.CreateUserUseCase)
        .to(CreateUserUseCase)
        .inSingletonScope();
    });

    return this;
  }

  private registerPollUseCases() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IUseCase>(USE_CASES_DI_TYPES.CreatePollUseCase)
        .to(CreatePollUseCase)
        .inSingletonScope();
    });

    return this;
  }

  private registerGetPollFeedUseCases() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IUseCase>(USE_CASES_DI_TYPES.GetPollFeedUseCase)
        .to(GetPollFeedUseCase)
        .inSingletonScope();
    });

    return this;
  }

  private registerVoteOnPollUseCase() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IUseCase>(USE_CASES_DI_TYPES.VoteOnPollUseCase)
        .to(VoteOnPollUseCase)
        .inSingletonScope();
    });

    return this;
  }
  private registerSkipOnPollUseCase() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IUseCase>(USE_CASES_DI_TYPES.SkipOnPollUseCase)
        .to(SkipOnPollUseCase)
        .inSingletonScope();
    });

    return this;
  }

  private registerStatsPollUseCase() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IUseCase>(USE_CASES_DI_TYPES.StatsPollUseCase)
        .to(StatsPollUseCase)
        .inSingletonScope();
    });

    return this;
  }
}
