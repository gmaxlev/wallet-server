import { BaseEntity } from '../BaseEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Account extends BaseEntity {
  @ManyToOne(() => User, (user) => user.accounts, {
    nullable: false,
  })
  user: User;

  @Column({ type: 'numeric', precision: 2, default: 0 })
  value: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  isMain: boolean;
}
