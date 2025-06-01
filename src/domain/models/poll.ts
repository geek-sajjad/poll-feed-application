import type { Id } from '@/core/id/id';

export type PollId = Id<'Poll'>;

export class Poll {
  id: PollId;
  title: string;
  options: string[]; // ["Option A", "Option B", "Option C"]
  tags: string[]; // ["technology", "opinion"]
  createdAt: Date;

  constructor(params: {
    id: string;
    title: string;
    options: string[];
    tags: string[];
    createdAt: Date;
  }) {
    this.id = params.id as PollId;
    this.tags = params.tags;
    this.options = params.options;
    this.title = params.title;
    this.createdAt = params.createdAt;
  }
}
