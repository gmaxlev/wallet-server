import { BaseEntity } from '../BaseEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class RefreshToken extends BaseEntity {
  @ManyToOne(() => User, (user) => user.refreshTokens, {
    nullable: false,
  })
  user: User;

  @Column({ unique: true })
  token: string;

  @Column({ unique: true })
  refresh: string;

  @Column({
    nullable: false,
  })
  exp: number;

  @Column({
    nullable: false,
  })
  agent: string;

  @Column({
    nullable: false,
  })
  ip: string;
}
