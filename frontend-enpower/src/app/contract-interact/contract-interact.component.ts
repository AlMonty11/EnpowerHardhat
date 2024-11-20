import { Component } from '@angular/core';
import { BlockchainService } from '../services/blockchain.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-contract-interact',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './contract-interact.component.html',
  styleUrls: ['./contract-interact.component.css']
})
export class ContractInteractComponent {
  walletAddress: string = ''; // Direccion de wallet de "samuel"
  contractAddress: string = '';
  methods: string[] = [];
  selectedMethod: string = '';
  amount: string = '';

  constructor(private blockchainService: BlockchainService) {
    this.blockchainService = blockchainService; // Obtener wallet de "samuel"
    this.getWalletAddress()?.toString();
  }

  //TODO: GetUsername Del Token
  getWalletAddress() {
    const username = localStorage.getItem('username');
    console.log("Username:", username);  // Verifica el username en consola
    if (!username) {
      return new Error('No username found in local storage');
    }
    this.blockchainService.getWalletInfo(username).subscribe(walletInfo => {
      this.walletAddress = walletInfo.walletAddress;
    });
    console.log("Wallet Address:", this.walletAddress);  // Verifica la dirección de wallet en consola
    return username;
  }
  

  fetchMethods() {
    this.blockchainService.getContractMethods(this.contractAddress).subscribe(methods => {
      this.methods = methods;
    });
  }

  async initiateTransaction() {
    console.log("Valor en el input amount:", this.amount);  // Verifica el valor en consola
    const transactionData = await this.blockchainService.invokeMethodOnContract(
      this.contractAddress, 
      this.selectedMethod, 
      this.amount,
    );
  
    await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionData],
    });
  }

  
}
