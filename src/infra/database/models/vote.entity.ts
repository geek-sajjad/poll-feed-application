import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { PollEntity } from './poll.entity';

@Entity('votes')
@Index(['userId', 'pollId'], { unique: true })
@Index(['pollId'])
@Index(['userId', 'createdAt'])
export class VoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  userId!: string;

  @Column({ type: 'uuid' })
  pollId!: string;

  @Column({ type: 'int', nullable: true })
  optionIndex!: number | null;

  @Column({ type: 'boolean', default: false })
  isSkip!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  // Relations
  @ManyToOne(() => PollEntity, poll => poll.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pollId' })
  poll!: PollEntity;

  // Helper methods
  isVote(): boolean {
    return !this.isSkip && this.optionIndex !== null;
  }

  getVoteType(): 'vote' | 'skip' {
    return this.isSkip ? 'skip' : 'vote';
  }
}
