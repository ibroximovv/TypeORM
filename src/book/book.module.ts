import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from 'src/entites/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from 'src/entites/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Genre])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
