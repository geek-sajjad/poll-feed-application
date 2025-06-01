import type { ContainerBuilder } from '@/container/container';
import { REPOSITORIES_DI_TYPES } from '@/container/repositories/di-types';
import { IPollRepository } from '@/domain/repositories/poll-repository.interface';
import type { IUserRepository } from '@/domain/repositories/user-repository.interface';
import { IVoteRepository } from '@/domain/repositories/vote-repository.interface';
import { PollRepository } from '@/infra/database/repositories/poll-repository';
import { UserRepository } from '@/infra/database/repositories/user-repository';
import { VoteRepository } from '@/infra/database/repositories/vote.repository';

export const registerRepositories = (containerBuilder: ContainerBuilder) => {
  const builder = new RepositoriesContainerBuilder(
    containerBuilder
  ).registerRepositories();

  return builder;
};

/**
 * This class is used to register all the repositories in the container
 */
class RepositoriesContainerBuilder {
  constructor(private readonly containerBuilder: ContainerBuilder) {}

  registerRepositories() {
    this.registerUserRepository()
      .registerPollRepository()
      .registerVoteRepository();

    return this.containerBuilder;
  }

  private registerUserRepository() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IUserRepository>(REPOSITORIES_DI_TYPES.UserRepository)
        .to(UserRepository)
        .inSingletonScope();
    });

    return this;
  }
  private registerPollRepository() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IPollRepository>(REPOSITORIES_DI_TYPES.PollRepository)
        .to(PollRepository)
        .inSingletonScope();
    });

    return this;
  }

  private registerVoteRepository() {
    this.containerBuilder.registerActions.push(container => {
      container
        .bind<IVoteRepository>(REPOSITORIES_DI_TYPES.VoteRepository)
        .to(VoteRepository)
        .inSingletonScope();
    });

    return this;
  }
}
