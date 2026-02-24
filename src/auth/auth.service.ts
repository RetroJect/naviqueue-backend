import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../users/user.schema';

export type JwtPayload = Pick<
  User,
  'displayName' | 'id' | 'login' | 'profileImageURL'
> & {
  // Optional JWT Claims
  sub?: string; // Subject
  exp?: number; // Expiration
  iat?: number; // Issued At
};

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login({ displayName, id, login, profileImageURL }: UserDocument) {
    const payload: JwtPayload = {
      displayName,
      id,
      login,
      profileImageURL,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        subject: id,
      }),
    };
  }
}
