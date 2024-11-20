/* eslint-disable prettier/prettier */
// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { KeycloakService } from '../keycloak/keycloak.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { Wallet } from 'ethers';

@Injectable()
export class UserService {
  private readonly ENCRYPTION_KEY: string;
  private readonly ALGORITHM = 'aes-256-ctr';
  
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly keycloakService: KeycloakService,
    private readonly blockchainService: BlockchainService,
  ) {
    this.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

    if (!this.ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY no está definido en las variables de entorno');
    }
  }

  // Método para encriptar texto
  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.ALGORITHM, Buffer.from(this.ENCRYPTION_KEY, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  // Método para desencriptar texto
   decrypt(encryptedText: string): string {
    const [ivHex, encryptedHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedTextBuffer = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(this.ALGORITHM, Buffer.from(this.ENCRYPTION_KEY, 'hex'), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedTextBuffer), decipher.final()]);
    return decrypted.toString();
  }

  // Método para registrar un nuevo usuario
  //async register(username: string, password: string, email: string, walletAddress: string, walletPublicKey: string, walletPrivateKey: string): Promise<User> {
  async register(username: string, password: string, email: string, walletAddress: string): Promise<User> {

    const hashedPassword = await this.hashPassword(password);
    const encryptedWalletAddress = this.encrypt(walletAddress);
    //TODO: private and Public Key review
    // const encryptedWalletPublicKey = this.encrypt(walletPublicKey);
    // const encryptedWalletPrivateKey = this.encrypt(walletPrivateKey);

    // Crear el usuario en Keycloak
    await this.createUserInKeycloak(username, email, password);
    

    // Guardar el nuevo usuario en MongoDB
    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
      walletAddress: encryptedWalletAddress,
      //walletAddress,
      // walletPrivateKey: encryptedWalletPrivateKey,
      // walletPublicKey: encryptedWalletPublicKey,
    });

    return newUser.save();
  }

  // Método para verificar las credenciales al iniciar sesión
  // async login(username: string, password: string): Promise<any> {
  //   const user = await this.findUserByUsername(username);
  //   if (!user) throw new Error('Usuario no encontrado');

  //   const isPasswordValid = await this.verifyPassword(user.password, password);
  //   if (!isPasswordValid) throw new Error('Contraseña incorrecta');

  //   const token = this.jwtService.sign({ id: user.id });
  //   return { accessToken: token, user };
  // }

  // Métodos auxiliares
  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  private async verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
  }


  async createUserInKeycloak(username: string, email: string, password: string): Promise<void> {
    try {
      await this.keycloakService.createUserInKeycloak(username, email, password);
    } catch (error) {
      console.error('Error al crear usuario en Keycloak:', error);
      throw new Error('No se pudo crear el usuario en Keycloak');
    }
  }

  private async findUserByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async checkUserWalletAddress(username: string): Promise<boolean> {
    try {
        const user = await this.findUserByUsername(username);
        console.log('User:', user);
        if (!user) return false;
        const decryptedWalletAddress = this.decrypt(user.walletAddress);
        return decryptedWalletAddress != "";
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
  }

  async getWalletInfo(username: string) {
    const user = await this.findUserByUsername(username);
    // const walletAddress = user?.walletAddress?.trim();
    const encryptedWalletAddress = user?.walletAddress?.trim();
    const walletAddress = this.decrypt(encryptedWalletAddress!);
    console.log(walletAddress);
    
    if (!walletAddress || !this.blockchainService.web3.utils.isAddress(walletAddress)) {
      throw new Error('El usuario no tiene una dirección de wallet válida asociada');
    }

    // Usar el BlockchainService para obtener el balance y las transacciones
    const balance = await this.blockchainService.getBalance(walletAddress);
    const transactions = await this.blockchainService.getTransactions(walletAddress);

    return { walletAddress, balance, transactions };
  }

  async findByUsername(username: string): Promise<User | null> {
  const user = await this.findUserByUsername(username); 
    return user;
  }
  
  async createWallet(username: string): Promise<any> {
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
  
    // Generar wallet (puedes usar la librería ethers.js)
    const wallet = Wallet.createRandom();
  
    // Encriptar y guardar los datos de la wallet
    const encryptedWalletAddress = this.encrypt(wallet.address);
    // const encryptedWalletPrivateKey = this.encrypt(wallet.privateKey);
    // const encryptedWalletPublicKey = this.encrypt(wallet.publicKey);
  
    //user.walletAddress = wallet.address;
    user.walletAddress = encryptedWalletAddress;
    // user.walletPrivateKey = encryptedWalletPrivateKey;
    // user.walletPublicKey = encryptedWalletPublicKey;

    //TODO: private and Public Key review
    // user.walletPrivateKey = wallet.privateKey;
    // user.walletPublicKey = wallet.publicKey;

    user.save();
  
    return user;
  }

  async addWalletAddress(username: string, walletAddress: string): Promise<any> {
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
  
    // Verificar si la dirección es válida
    if (!this.blockchainService.web3.utils.isAddress(walletAddress)) {
      throw new Error('Dirección de wallet no válida');
    }
  
    const encryptedWalletAddress = this.encrypt(walletAddress);
    user.walletAddress = encryptedWalletAddress;
    //user.walletAddress = walletAddress;
  
    return user.save();
  }
  

}
