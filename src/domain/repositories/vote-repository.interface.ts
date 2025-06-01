// src/domain/repositories/IVoteRepository.ts

import { Poll } from '../models/poll';
import { Vote } from '../models/vote';

export interface IPollStats {
  pollId: string;

  votes: Array<{
    option: string;
    count: number;
  }>;
}
export interface IVoteRepository {
  countUserVotesToday(userId: string): Promise<number>;
  findByUserAndPoll(userId: string, pollId: string): Promise<Vote | null>;
  save(vote: Vote): Promise<void>;

  findById(id: string): Promise<Vote | null>;
  getPollStats(poll: Poll): Promise<IPollStats>;
}
