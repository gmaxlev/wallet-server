import { BaseEntity } from '../BaseEntity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { User } from './User';
import { Account } from './Account';

@Entity()
export class Category extends BaseEntity {
  @ManyToOne(() => User, (user) => user.categories, {
    nullable: false,
  })
  user: User;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => Account)
  @JoinTable()
  accounts: Account[];
}
