import {
  Prop,
  Schema,
  SchemaFactory,
} from "@nestjs/mongoose";

import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  SENIOR = "senior",
  FAMILY = "family",
  COMPANION = "companion",
  ADMIN = "admin",
}

@Schema({
  timestamps: true,
  collection: "users",
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email!: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  phone!: string;

  @Prop({
    required: true,
    select: false,
  })
  passwordHash!: string;

  @Prop({
    required: true,
    enum: Object.values(UserRole),
    index: true,
  })
  role!: UserRole;

  @Prop({
    default: true,
    index: true,
  })
  isActive!: boolean;

  @Prop({
    default: 0,
  })
  tokenVersion!: number;
}

export const UserSchema =
  SchemaFactory.createForClass(User);