import { LoginDto } from './dtos/login.dto';
import { CreateUserDto } from './../users/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await user.comparePassword(pass))) {
      const { password, ...result } = user.toJSON();
      return result;
    }
    return null;
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exist');
    }

    return await this.usersService.create(createUserDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user)
      throw new UnauthorizedException('Email or Password is incorrect');

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      full_name: `${user.first_name} ${user.last_name}`,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: payload,
    };
  }
}
