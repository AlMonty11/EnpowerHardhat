/* eslint-disable prettier/prettier */
// user.controller.ts
import { Controller, Post, Body, Get, UseGuards, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { KeycloakService } from '../keycloak/keycloak.service';
import { AuthGuard } from '../guards/auth.guard';
import { BlockchainService } from '../blockchain/blockchain.service';

@Controller('/users')
export class UserController {
  constructor(
      private readonly userService: UserService,
      private readonly keycloakService : KeycloakService,
      private readonly blockchainService: BlockchainService
    ) {}

  @Post('register')
  async register(
      @Body('username') username: string,
      @Body('password') password: string,
      @Body('email') email: string,
      @Body('walletAddress') walletAddress: string,
      //TODO: private and Public Key review
      // @Body('walletPublicKey') walletPublicKey: string,
      // @Body('walletPrivateKey') walletPrivateKey: string
    ) {
      console.log("username", username);
      //TODO: private and Public Key review
    //return this.userService.register(username, password, email, walletAddress, walletPublicKey, walletPrivateKey);

    return this.userService.register(username, password, email, walletAddress);
  }

  @Get('health')
  @UseGuards(AuthGuard)
  async healthCheck() {
    return { message: 'El servidor está funcionando correctamente' };
  }

  @Post('/wallet')
  async getWallet(@Body('username') username: string) {;
    return this.userService.checkUserWalletAddress(username);
  }

  @Get('wallet-info/:username')
  async getWalletInfo(@Param('username') username: string) {
    // Obtener la dirección de la wallet del usuario
    console.log("LLEGA")
    const user = await this.userService.findByUsername(username);
    const encryptedWalletAddress = user?.walletAddress?.trim();
    const walletAddress = this.userService.decrypt(encryptedWalletAddress!);
    console.log("walletAddress", walletAddress);
  
    if (!walletAddress || !this.blockchainService.web3.utils.isAddress(walletAddress)) {
      throw new Error('El usuario no tiene una dirección de wallet válida asociada');
    }
  
    // Usar el BlockchainService para obtener el balance y las transacciones
    const balance = await this.blockchainService.getBalance(walletAddress);
    const transactions = await this.blockchainService.getTransactions(walletAddress);
  
    return {
      walletAddress,
      balance,
      transactions,
    };
  }

  @Post('create-wallet')
  async createWallet(@Body('username') username: string) {
    return this.userService.createWallet(username);
  }

  @Post('add-wallet-address')
  async addWalletAddress(@Body('username') username: string, @Body('walletAddress') walletAddress: string) {
    return this.userService.addWalletAddress(username, walletAddress);
  }
}
