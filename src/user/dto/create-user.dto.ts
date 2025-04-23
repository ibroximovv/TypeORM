import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

export class CreateUserDto {
    @ApiProperty({ example: 'username'})
    @IsString()
    username: string

    @ApiProperty({ example: 'username@gmail.com'})
    @IsEmail()
    email: string
}
