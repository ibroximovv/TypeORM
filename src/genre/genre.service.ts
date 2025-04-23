import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from 'src/entites/genre.entity';
import { Like, Repository } from 'typeorm';
import { GetGenreDto } from './dto/get-genre.dto';

@Injectable()
export class GenreService {
  constructor(@InjectRepository(Genre) private readonly genre: Repository<Genre>){}
  async create(createGenreDto: CreateGenreDto) {
    try {
      const data = this.genre.create(createGenreDto)
      const created = await this.genre.save(data)
      return created;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async findAll(query: GetGenreDto) {
    const { search, page = 1, limit = 10, order = 'desc', column = 'id'} = query
    try {
      const where: any[] = []

      if (search) {
        if (column == 'id') {
          where.push({ id: Like(`%${search}%`)})
        } else {
          where.push({ name: Like(`%${search}%`)})
        }
      }

      return await this.genre.find({
        where: where.length ? where : undefined,
        order: {[column]: order.toUpperCase()},
        skip: ( page - 1) * limit,
        take: limit
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.genre.findOneBy({ id })
      if (!data) {
        return { message: 'Genre not found' }
      }
      return data;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    try {
      const one = await this.findOne(id)
      if(!one[0]) {
        return { message: 'Genre not found'}
      }
      await this.genre.update(id, updateGenreDto)
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
        return { message: 'Genre not found'}
      }
      await this.genre.delete(id)
      return one[0]
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Internal server error')
    }
  }
}
