import { Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { OrganizationStatus } from '../enums/organization.enum';
import { User } from 'src/users/schemas/user.schema';

export class Organization {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  ownerId: User;

  @Prop({ default: true })
  status: OrganizationStatus;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
