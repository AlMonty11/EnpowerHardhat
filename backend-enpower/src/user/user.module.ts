// user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { KeycloakService } from '../keycloak/keycloak.service';
import { BlockchainService } from '../blockchain/blockchain.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'your_secret_key', // Cambia esto a una clave más segura y sácala del código
      signOptions: { expiresIn: '60s' }, // Ajusta el tiempo de expiración según tus necesidades
    }),
    KeycloakModule,
  ],
  controllers: [UserController],
  providers: [UserService, KeycloakService, BlockchainService],
})
export class UserModule {}
