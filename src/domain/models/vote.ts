import type { Id } from '@/core/id/id';

export type UserId = Id<'User'>;
export type PollId = Id<'Poll'>;
export type VoteId = Id<'Vote'>;
export class Vote {
  id: VoteId;
  userId: UserId;
  pollId: PollId;
  optionIndex: number | null;
  isSkip: boolean;
  createdAt: Date;

  constructor(params: {
    id: string;
    userId: string;
    pollId: string;
    optionIndex: number | null;
    isSkip: boolean;
    createdAt: Date;
  }) {
    this.id = params.id as VoteId;
    this.userId = params.userId as UserId;
    this.pollId = params.pollId as PollId;
    this.optionIndex = params.optionIndex;
    this.isSkip = params.isSkip;
    this.createdAt = params.createdAt;
  }
}
