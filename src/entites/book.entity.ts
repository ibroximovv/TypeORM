
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Genre } from './genre.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  color: string;

  @ManyToOne(() => User, (user) => user.book)
  user: User;

  @ManyToMany(() => Genre, (genre) => genre.book, {eager: true})
  @JoinTable()
  genre: Genre[];
}
