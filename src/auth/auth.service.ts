import { CreateUserDto } from './../users/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exist');
    }

    return await this.usersService.create(createUserDto);
  }
}
