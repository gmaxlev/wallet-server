import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/CreateUserDto';
import * as bcrypt from 'bcrypt';
import { CheckCredentialsDto } from '../dto/CheckCredentialsDto';
import { User } from '../../database/entities/User';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DuplicateEmail } from '../errors';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(
    { email, password }: CreateUserDto,
    entityManager = this.dataSource.manager,
  ) {
    const existed = await this.userRepository.findOneBy({ email });

    if (existed) {
      throw new DuplicateEmail(
        `A user with email ${email} has already existed`,
      );
    }

    const user = new User();
    user.email = email;
    user.password = await bcrypt.hash(password, await bcrypt.genSalt());

    return entityManager.save(user);
  }

  async getUserByCredentials({ email, password }: CheckCredentialsDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select()
      .where('user.email = :email', { email: email })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      return null;
    }

    if (await bcrypt.compare(password, user.password)) {
      return user;
    }

    return null;
  }

  getUser(id: number, entityManager = this.dataSource.manager) {
    return entityManager.findOne(User, {
      where: {
        id,
      },
    });
  }
}
