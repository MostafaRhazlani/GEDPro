import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Roles } from '../enums/user.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Mostafa',
    description: 'The first name of the user',
  })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Rhazlani',
    description: 'The last name of the user',
  })
  last_name: string;

  @IsEmail({}, { message: 'Please enter a valid email' })
  @IsNotEmpty()
  @ApiProperty({
    example: 'mostafa@example.com',
    description: 'User email address',
  })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @ApiProperty({
    example: 'password',
    format: 'password',
  })
  password: string;

  @IsOptional()
  @IsEnum(Roles)
  role?: Roles;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
