import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Raqamli Qala' })
  @IsString()
  name: string;

  @ApiProperty({ example: 21344 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'white' })
  @IsString()
  color: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: [1, 2] })
  @IsArray()
  genreIds: number[];
}
