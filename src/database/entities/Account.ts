import { BaseEntity } from '../BaseEntity';
import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { Currency } from './Currency';

@Entity()
export class Account extends BaseEntity {
  @ManyToOne(() => User, (user) => user.accounts, {
    nullable: false,
  })
  user: User;

  @Column({ type: 'numeric', scale: 2, default: 0 })
  balance: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Currency, (currency) => currency.accounts, {
    nullable: false,
  })
  currency: Currency;

  @AfterLoad()
  private valueToNumber() {
    this.balance = parseFloat(this.balance as any);
  }
}
