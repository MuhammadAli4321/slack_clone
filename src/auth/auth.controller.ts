import {
  Body,
  Controller,
  Post,
  Headers,
  ValidationPipe,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from 'src/dto/user-register.dto';
import { LoginDto } from 'src/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: UserRegisterDto): Promise<any> {
    return await this.authService.register(userDto);
  }

  @Post('login')
  async login(
    @Body(ValidationPipe) loginUserDto: LoginDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.login(loginUserDto);
  }

  @Get('details')
  async getUserDetails(@Headers('authorization') authorizationHeader: string) {
    // Extract the token from the authorization header
    const token = authorizationHeader?.split(' ')[1];

    if (!token) {
      // Handle case where token is missing
      throw new Error('Authorization token is missing');
    }
    return this.authService.getUserDetails(token);
  }
  @Get('users')
  async findAll(): Promise<{ id: string; username: string }[]> {
    return this.authService.findAll();
  }
}
