import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { GenreModule } from './genre/genre.module';
import { User } from './entites/user.entity';
import { Genre } from './entites/genre.entity';
import { Book } from './entites/book.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1333',
      database: 'test',
      entities: [User, Genre, Book],
      synchronize: true,
    }),
    UserModule,
    BookModule,
    GenreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
