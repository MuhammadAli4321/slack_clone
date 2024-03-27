// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from 'src/dto/user-register.dto';
import { User } from './../schemas/user.schema';
import { LoginDto } from 'src/dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(userDto: UserRegisterDto): Promise<any> {
    try {
      const { password, ...rest } = userDto;
      const hashedPassword = await this.hashPassword(password);
      const createdUser = new this.userModel({
        ...rest,
        password: hashedPassword,
      });
      const newUser = await createdUser.save(); // Save the new user to the database
      const payload = { username: newUser.username, userId: newUser.id };
      const accessToken = this.jwtService.sign(payload); // Generate JWT token
      return { accessToken }; // Return the JWT token
    } catch (error) {
      throw new Error('Failed to register user: ' + error.message); // Throw an error if registration fails
    }
  }

  async login(loginUserDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = loginUserDto;
    const user = await this.userModel.findOne({ username });
    if (user && (await this.validatePassword(password, user.password))) {
      const payload = { username: user.username, userId: user.id };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  getUserDetails(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token);
      return decodedToken;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async findAll(): Promise<{ id: string; username: string }[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => ({ id: user._id, username: user.username }));
  }

  async validatePassword(
    enteredPassword: string,
    dbPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }
  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
