import { BaseEntity } from '../BaseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RefreshToken } from './RefreshToken';
import { UserRole } from '../../user/roles';
import { Account } from './Account';

@Entity()
export class User extends BaseEntity {
  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
    select: false,
  })
  password: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens: RefreshToken[];

  @OneToMany(() => Account, (account) => account.user, {
    cascade: true,
  })
  accounts: Account[];

  @Column({
    type: 'simple-json',
    default: [UserRole.USER],
  })
  roles: number[];
}
