import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { RawTwitchPassportProfile } from 'src/auth/twitch.strategy';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createOrUpdateFromRaw(
    accessToken: string,
    refreshToken: string,
    user: RawTwitchPassportProfile,
  ): Promise<UserDocument> {
    try {
      // Find a user by ID or create a new instance if not found
      const foundUser = await this.userModel.findOneAndUpdate(
        { id: user.id },
        {
          ...user,
          accessToken,
          refreshToken,
        },
        {
          returnDocument: 'after', // Return updated document
          upsert: true, // Create if not found
        },
      );

      return foundUser;
    } catch (error) {
      console.error(`Unable to find or update user document`, error);

      throw error;
    }
  }
}
