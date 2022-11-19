import { BaseEntity } from '../BaseEntity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Account } from './Account';

@Entity()
export class Currency extends BaseEntity {
  @Column()
  code: string;

  @Column()
  description: string;

  @ManyToOne(() => Account, (account) => account.currency)
  accounts: Account[];
}
