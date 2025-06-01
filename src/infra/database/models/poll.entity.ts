import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VoteEntity } from './vote.entity';

@Entity({ name: 'polls' })
export class PollEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  title!: string;

  @Column('json', { nullable: false })
  options!: string[];

  @Index({ where: 'tags IS NOT NULL', spatial: false })
  @Index('poll_tags_gin_index', { synchronize: false }) // manually created
  @Column('text', { array: true, nullable: false })
  tags!: string[];

  @Index()
  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  // Relations
  @OneToMany(() => VoteEntity, vote => vote.poll, { cascade: true })
  votes!: VoteEntity[];
}
