import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Or, Repository } from 'typeorm';
import { Book } from 'src/entites/book.entity';
import { Genre } from 'src/entites/genre.entity';
import { GetBookDto } from './dto/get-book.dto';

@Injectable()
export class BookService {
  constructor(@InjectRepository(Book) private readonly book: Repository<Book>, @InjectRepository(Genre) private readonly genre: Repository<Genre>){}
  async create(createBookDto: CreateBookDto) {
    try {
      const genres = createBookDto.genreIds.map((id) => ({ id }));
      const data = this.book.create({
        ...createBookDto,
        user: { id: createBookDto.userId },
        genre: genres
      });
      return await this.book.save(data); 
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Internal server error')
    }
  }
  
  async findAll(query: GetBookDto) {
    const { search, page = 1, limit = 10, order = 'desc', column = 'id'} = query
    try {
      const where: any[] = []

      if (search) {
        if (column == 'id') {
          where.push({ id: Like(`%${search}%`) });
        } else if (column == 'name') {
          where.push({ name: Like(`%${search}%`) });
        } else {
          where.push({ color: Like(`%${search}%`) })
        }
      }

      return await this.book.find({
        where: where.length ? where : undefined,
        order: {[column]: order.toUpperCase()},
        skip: ( page - 1) * limit,
        take: limit,
        relations: ['genre', 'user']
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.book.findOneBy({ id })
      if (!data) {
        return { message: 'Book not found' }
      }
      return data;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    try {
      const one = await this.findOne(id)
      if(!one[0]) {
        return { message: 'Book not found'}
      }
      await this.book.update(id, updateBookDto)
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
        return { message: 'Book not found'}
      }
      await this.book.delete(id)
      return one[0]
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Internal server error')
    }
  }
}
