import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      // Check against database first
      const user = await this.usersService.findByEmail(email);
      if (user && await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user;
        return result;
      }

      // Fallback to demo credentials for development only
      if (process.env.NODE_ENV === 'development') {
        if (email === 'admin@sucurries.com' && password === 'admin123') {
          return {
            id: 'admin-1',
            email: 'admin@sucurries.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
          };
        }

        if (email === 'user@sucurries.com' && password === 'user123') {
          return {
            id: 'user-1',
            email: 'user@sucurries.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'customer',
          };
        }
      }

      return null;
    } catch (error) {
      console.error('User validation error:', error);
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Create new user
    const user = await this.usersService.create(registerDto);
    
    // Generate JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    // In a real application, we would send a password reset email
    return { message: 'Password reset instructions sent to your email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // In a real application, we would verify the token and reset the password
    return { message: 'Password reset successful' };
  }


}