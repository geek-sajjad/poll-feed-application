import type { Poll } from '@/domain/models/poll';
export interface IPollStats {
  pollId: string;

  votes: Array<{
    option: string;
    count: number;
  }>;
}

export interface IPollRepository {
  save(poll: Poll): Promise<void>;

  findById(id: string): Promise<Poll | null>;

  findPollsForFeed(filters: PollFeedFilters): Promise<Poll[]>;
}

export interface PollFeedFilters {
  tags?: string[];
  limit?: number;
  offset?: number;
  excludeUserPolls?: string; // userId to exclude user's own polls
  excludeVotedPolls?: string; // userId to exclude already voted polls
}
