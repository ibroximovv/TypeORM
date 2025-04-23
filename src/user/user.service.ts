import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from 'src/entites/user.entity';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly user: Repository<User>){}
  async create(createUserDto: CreateUserDto) {
    try {
      const data = this.user.create(createUserDto)
      return this.user.save(data);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async findAll(query: GetUserDto) {
    const { search, page = 1, limit = 10, order = 'desc', column = 'id' } = query
    try {
      const where: any[] = []

      if( search ) {
        if (column == 'id') {
          where.push({ id: Like(`%${search}%`)})
        } else if (column == 'username') {
          where.push({ username: Like(`%${search}%`)})
        } else {
          where.push({ email: Like(`%${search}%`)})
        }
      }
      return await this.user.find({
        where: where.length ? where : undefined,
        order: {[column]: order.toUpperCase()},
        skip: ( page - 1 ) * limit,
        take: limit
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.user.findBy({ id });
      if (!data[0]) {
        return { message: 'User not found'}
      }
      return data[0]
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const one = await this.findOne(id)
      if(!one[0]) {
        return { message: 'User not found'}
      }
      await this.user.update(id, updateUserDto)
      const one1 = await this.findOne(id)
      return one1[0]
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async remove(id: number) {
    try {
      const one = await this.findOne(id)
      if(!one[0]) {
        return { message: 'User not found'}
      }
      await this.user.delete(id)
      return one[0]
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Internal server error')
    }
  }
}
