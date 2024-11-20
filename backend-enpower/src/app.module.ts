// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BlockchainService } from './blockchain/blockchain.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.DB_IP}:27017/${process.env.MONGO_DB}`),
    UserModule,
    AuthModule
  ],
  providers: [BlockchainService],
})
export class AppModule {}
