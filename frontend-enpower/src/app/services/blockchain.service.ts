import Web3 from 'web3';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import axios from 'axios';

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}
@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  web3!: Web3;
    http: any;
    walletAddress: any;

  constructor() {
        // Asegúrate de que MetaMask esté instalado y configurado como proveedor de web3
        if (window.ethereum) {
          this.web3 = new Web3(window.ethereum);
          window.ethereum.request({ method: 'eth_requestAccounts' });
        } else if (window.web3) {
          // Legacy dapp browsers...
          this.web3 = new Web3(window.web3.currentProvider);
        } else {
          console.error("No Ethereum provider detected. Install MetaMask!");
        }
    // Inicializar Web3 (asegúrate de que está conectado al nodo adecuado)
    //this.web3 = new Web3('https://sepolia.infura.io/v3/7e851c68e046408d9e11f6a5c0cf5542');
  }

  // Función para convertir de Wei a ETH
  convertWeiToEth(valueInWei: string): string {
    return this.web3.utils.fromWei(valueInWei, 'ether');
  }

  getWalletInfo(username: string): Observable<any> {
    const url = `http://localhost:3000/users/wallet-info/${username}`;
    return from(axios.get<any>(url).then(response => response.data));
  }

  getContractMethods(contractAddress: string): Observable<string[]> {
    const methodsPromise = this.fetchContractABI(contractAddress).then(abi => {
      const contract = new this.web3.eth.Contract(abi, contractAddress);
      console.log("Métodos del contrato:", Object.keys(contract.methods));
      return Object.keys(contract.methods);
    });
    
    return from(methodsPromise); // Convierte la promesa a Observable
  }

  async invokeMethodOnContract(contractAddress: string, methodName: string, amount: string) {
    console.log("Invocando método en contrato:", methodName);
  
    // Obtiene el ABI del contrato y crea la instancia del contrato con el ABI y dirección correctos
    const abi = await this.fetchContractABI(contractAddress);
    const contract = new this.web3.eth.Contract(abi, contractAddress);
    const walletUser = await this.getWalletAddress();
    console.log("Dirección del usuario:", walletUser);
  
    // Solicita acceso a MetaMask y obtiene la cuenta del usuario
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log("Cuentas de MetaMask:", accounts);
    const userAccount = await accounts.find((account: string) => this.web3.utils.toChecksumAddress(account) == this.web3.utils.toChecksumAddress(walletUser)) ;
    console.log("Cuenta del usuario:", userAccount);
    // Convierte el monto a Wei para que esté en la unidad correcta para Ethereum
    const valueInWei = amount ? this.web3.utils.toWei(amount, 'ether') : '0';
  
    console.log("Cuenta del usuario:", userAccount);
    console.log("Monto en Wei:", valueInWei);
  
    try {
      // Llama al método `enter` o cualquier otro método definido en `methodName` usando `.send()`
      await contract.methods[methodName]().send({
        from: walletUser,
        value: valueInWei,  // Monto en Wei que se envía con la transacción
      });
  
      console.log("Transacción enviada exitosamente.");
    } catch (error) {
      console.error("Error al enviar la transacción:", error);
      throw error;
    }
  }
  

  private async fetchContractABI(contractAddress: string): Promise<any> {
    const etherScanApiKey = '3FPQ17Z3EP7I6J737S1DXG2YQMNEDU84U1'; //TODO: Change for Environment Variable
    const normalizedAddress = this.web3.utils.toChecksumAddress(contractAddress);
    try {
      //TODO: Add environment variable for the API Key and api URL (Current Sepolia TEST NETWORK)
      const response = await axios.get(`https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${normalizedAddress}&apikey=${etherScanApiKey}`);
  
      console.log("Respuesta completa de Etherscan:", response.data);
  
      // Verifica si la respuesta contiene el ABI y está en formato JSON esperado
      if (response.data && response.data.status === "1") {
        return JSON.parse(response.data.result);
      } else {
        console.error("Error al obtener el ABI:", response.data?.result || "Respuesta no válida");
        throw new Error("No se pudo obtener el ABI del contrato. Verifique la dirección del contrato y la API Key.");
      }
    } catch (error) {
      console.error("Error en fetchContractABI:", error);
      throw new Error("Error al obtener el ABI del contrato. Verifique la conexión y la respuesta de Etherscan.");
    }
  }

  async getWalletAddress(): Promise<string> {
    const username = localStorage.getItem('username');
    if (!username) {
      throw new Error('No username found in local storage');
    }
    const walletInfo = await this.getWalletInfo(username).toPromise();
    this.walletAddress = walletInfo.walletAddress;
    return this.walletAddress;
  }
}
