import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // For demo purposes, hardcode admin and user
    if (payload.email === 'admin@sucurries.com') {
      return {
        id: 'admin-1',
        email: 'admin@sucurries.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      };
    }

    if (payload.email === 'user@sucurries.com') {
      return {
        id: 'user-1',
        email: 'user@sucurries.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer',
      };
    }

    // In a real application, we would check against database
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}