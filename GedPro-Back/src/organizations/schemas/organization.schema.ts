import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { OrganizationStatus } from '../enums/organization.enum';
import { User } from 'src/users/schemas/user.schema';
import { HydratedDocument } from 'mongoose';

export type OrganizationDocument = HydratedDocument<Organization>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret: any) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Organization {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  ownerId: mongoose.Types.ObjectId | User;

  @Prop({ default: OrganizationStatus.PENDING, enum: OrganizationStatus })
  status: OrganizationStatus;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
