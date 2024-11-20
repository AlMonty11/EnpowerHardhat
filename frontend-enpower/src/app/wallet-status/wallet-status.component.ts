import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { BlockchainService } from '../services/blockchain.service';
import { Router } from '@angular/router';
import { NgIf, NgForOf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wallet-status',
  standalone: true,
  imports: [NgIf, NgForOf, FormsModule, NgClass], // Agregar FormsModule aquí
  templateUrl: './wallet-status.component.html',
  styleUrls: ['./wallet-status.component.css']
})
export class WalletStatusComponent implements OnInit {
  hasWallet: boolean | null = null;
  walletInfo: any = null;
  showWalletInput = false;
  manualWalletAddress = '';
  nameofuser = localStorage.getItem('username');/* 'pepe' */ //TODO: Change this to the logic to get the logged in user
  constructor(private userService: UserService, private blockchainService: BlockchainService, private router: Router) { }
  
  
  ngOnInit(): void {
    console.log(this.nameofuser);
    this.checkWallet();
  }

  checkWallet() {
    if(!this.nameofuser){
      throw Error("Username no especificado")
    }
    const username = this.nameofuser; // Cambia esto por la lógica de obtener el usuario logueado
    console.log("Username:", username);
    this.userService.getWalletInfo(username).subscribe(
      (response) => {
        this.hasWallet = true;
        this.walletInfo = response;
      },
      (error) => {
        console.error('Error al obtener la información de la wallet:', error);
        this.hasWallet = false;
      }
    );
  }

  createWallet(): void {
    if(!this.nameofuser){
      throw Error("Username no especificado")
    }
    const username = this.nameofuser; // Cambia esto por la lógica de obtener el usuario logueado
    this.userService.createWallet(username).subscribe(
      (response) => {
        console.log('Wallet creada:', response);
        this.checkWallet();
      },
      (error) => {
        console.error('Error al crear wallet:', error);
      }
    );
  }

  addWalletAddress(): void {
    this.showWalletInput = true;
  }

  submitWalletAddress(): void {
    if(!this.nameofuser){
      throw Error("Username no especificado")
    }
    const username = this.nameofuser; // Cambia esto por la lógica de obtener el usuario logueado
    this.userService.addWalletAddress(username, this.manualWalletAddress).subscribe(
      (response) => {
        console.log('Dirección de wallet guardada:', response);
        this.checkWallet();
      },
      (error) => {
        console.error('Error al guardar la dirección de wallet:', error);
      }
    );
  }

  goToMetaMaskTutorial(): void {
    window.open('https://metamask.io/', '_blank');
  }

  convert(wei: string): string {
    return this.blockchainService.convertWeiToEth(wei);
  }
}
