// src/users/schemas/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  username!: string;

  @Prop({ required: true })
  email!: string; // Añadimos email para el registro en Keycloak

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  walletAddress!: string;

  //TODO: private and Public Key review

  // @Prop({ required: true })
  // walletPrivateKey!: string;

  // @Prop({ required: true })
  // walletPublicKey!: string;

  @Prop({ default: ['user'] }) // Opcional: Puedes añadir roles si es necesario
  roles!: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
