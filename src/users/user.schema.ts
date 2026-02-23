import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop()
  accessToken?: string;

  @Prop({
    required: true,
    enum: ['affiliate', 'partner', ''],
    alias: 'broadcaster_type',
  })
  broadcasterType: string;

  @Prop({ required: true, alias: 'created_at' })
  createdAt: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, alias: 'display_name' })
  displayName: string;

  @Prop()
  email?: string;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true, alias: 'offline_image_url' })
  offlineImageURL: string;

  @Virtual({
    get: function (this: User) {
      if (!this.requestCooldown) return false;

      if (Date.now() >= this.requestCooldown.getTime()) {
        return false;
      } else {
        return true;
      }
    },
  })
  onCooldown: boolean;

  @Prop({ required: true, alias: 'profile_image_url' })
  profileImageURL: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  requestCooldown?: Date;

  @Prop({ required: true, enum: ['admin', 'global_mod', 'staff', ''] })
  type: string;

  @Prop({ alias: 'view_count' })
  viewCount?: number;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
