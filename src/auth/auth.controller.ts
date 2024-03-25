import { HttpException, HttpStatus } from '@nestjs/common';
import { Body, Controller, Post, ValidationPipe, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from 'src/dto/user-register.dto';
import { LoginDto } from 'src/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: UserRegisterDto): Promise<any> {
    try {
      await this.authService.register(userDto);
      return { message: 'User registered successfully', success: true };
    } catch (error) {
      if (error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginUserDto: LoginDto): Promise<any> {
    try {
      const token = await this.authService.login(loginUserDto);
      return {
        accessToken: token,
        message: 'Successful sign-in',
        success: true,
      };
    } catch (error) {
      if (error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get('users')
  async findAll(): Promise<{ id: string; username: string }[]> {
    return this.authService.findAll();
  }
}
