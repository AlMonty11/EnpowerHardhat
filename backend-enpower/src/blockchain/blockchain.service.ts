/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import Web3 from 'web3';

@Injectable()
export class BlockchainService {
  web3: Web3;

  constructor() {
    // Aquí se especifica la URL del nodo de la blockchain (puede ser Infura, Alchemy, etc.)
    const infuraNode = process.env.INFURA_NODE;
    if (!infuraNode) {
      throw new Error("INFURA_NODE environment variable is not set");
    }
    this.web3 = new Web3(new Web3.providers.HttpProvider(infuraNode));
  }

  // Obtener el balance de una wallet
  async getBalance(walletAddress: string ): Promise<string> {
    if (!this.web3.utils.isAddress(walletAddress)) {
      throw new Error('La dirección de la wallet no es válida');
    }

    try {
      const balanceWei = await this.web3.eth.getBalance(walletAddress);
      const balanceEth = this.web3.utils.fromWei(balanceWei, 'ether');
      return balanceEth; // Devolver el balance en ETH
    } catch (error) {
      console.error('Error al obtener el balance:', error);
      throw new Error('No se pudo obtener el balance');
    }
  }

  // Obtener las transacciones de una wallet (Aquí un ejemplo básico)
  // async getTransactions(walletAddress: string): Promise<any[]> {
  //   if (!this.web3.utils.isAddress(walletAddress)) {
  //     throw new Error('La dirección de la wallet no es válida');
  //   }
  
  //   try {
  //     const latestBlock = await this.web3.eth.getBlockNumber();
  //     const transactions: any[] = [];
  
  //     // TODO: TALK WITH PAOLO - Range of blocks to check BECAUSE WE DID A TRANSACTION THERE (6928827)
  //     for (let i = 6928829; i >= 6928823 - 2; i--) {
  //       const block = await this.web3.eth.getBlock(i, true);
  //       if (block && block.transactions) {
  //         for (const tx of block.transactions) {
  //           if (typeof tx !== 'string' && 'from' in tx && 'to' in tx) {
  //             const normalizedFrom = this.web3.utils.toChecksumAddress(tx.from);
  //             const normalizedTo = tx.to ? this.web3.utils.toChecksumAddress(tx.to) : null;
  //             const normalizedWalletAddress = this.web3.utils.toChecksumAddress(walletAddress);
  
  //             if (normalizedFrom === normalizedWalletAddress || normalizedTo === normalizedWalletAddress) {
  //               transactions.push({
  //                 ...tx,
  //                 blockNumber: tx.blockNumber?.toString(),
  //                 gas: tx.gas?.toString(),
  //                 gasPrice: tx.gasPrice?.toString(),
  //                 maxFeePerGas: tx.maxFeePerGas?.toString(),
  //                 maxPriorityFeePerGas: tx.maxPriorityFeePerGas?.toString(),
  //                 nonce: tx.nonce?.toString(),
  //                 transactionIndex: tx.transactionIndex?.toString(),
  //                 value: tx.value?.toString(),
  //                 type: tx.type?.toString(),
  //                 v: tx.v?.toString(),
  //                 chainId: tx.chainId?.toString(),
  //                 from: normalizedFrom,
  //                 to: normalizedTo,
  //               });
  //             }
  //           }
  //         }
  //       }
  //     }
  //     console.log("transactions", transactions);
  //     return transactions;
  //   } catch (error) {
  //     console.error('Error al obtener transacciones:', error);
  //     throw new Error('No se pudieron obtener las transacciones');
  //   }
  // }
  
  async getTransactions(walletAddress: string): Promise<any[]> {
    const etherscanUrl = process.env.ETHERSCAN_URL;
    const apiKey = process.env.BLOCKCHAIN_API_KEY;
    const lastBlock = await this.web3.eth.getBlockNumber();
    if (!this.web3.utils.isAddress(walletAddress)) {
      throw new Error('Invalid wallet address');
    }

    try {
      const url = `${etherscanUrl}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=${lastBlock}&sort=desc&apikey=${apiKey}`;
      const response = await axios.get(url);
      const transactions = response.data.result;

      return transactions.map((tx: any) => ({
        ...tx,
        blockNumber: tx.blockNumber?.toString(),
        gas: tx.gas?.toString(),
        gasPrice: tx.gasPrice?.toString(),
        maxFeePerGas: tx.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas?.toString(),
        nonce: tx.nonce?.toString(),
        transactionIndex: tx.transactionIndex?.toString(),
        value: tx.value?.toString(),
        type: tx.type?.toString(),
        v: tx.v?.toString(),
        chainId: tx.chainId?.toString(),
        from: this.web3.utils.toChecksumAddress(tx.from),
        to: tx.to ? this.web3.utils.toChecksumAddress(tx.to) : null,
        date: new Date(tx.timeStamp * 1000).toLocaleString(), // Convert timestamp to date
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Could not fetch transactions');
    }
  }

  async getContractMethods(contractAddress: string): Promise<string[]> {
    const abi = await this.fetchContractABI(contractAddress); // Obtén ABI desde Etherscan o tu fuente
    const contract = new this.web3.eth.Contract(abi, contractAddress);
    return contract.methods ? Object.keys(contract.methods) : [];
  }
  
  private async fetchContractABI(contractAddress: string): Promise<any> {
    const etherScanApiKey = '3FPQ17Z3EP7I6J737S1DXG2YQMNEDU84U1'; //TODO: Change for Environment Variable
    const normalizedAddress = this.web3.utils.toChecksumAddress(contractAddress);
    try {
      //TODO: Add environment variable for the API Key and api URL (Current Sepolia TEST NETWORK)
      const response = await axios.get(`https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${normalizedAddress}&apikey=${etherScanApiKey}`);
  
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
  

  async invokeMethodOnContract(contractAddress: string, method: string, amount: string): Promise<any> {
    const abi = await this.fetchContractABI(contractAddress);
    const contract = new this.web3.eth.Contract(abi, contractAddress);
    const data = contract.methods[method]().encodeABI();
  
    // Prepara la transacción y devuélvela para que MetaMask la firme
    return {
      to: contractAddress,
      data,
      value: this.web3.utils.toWei(amount, 'ether')
    };
  }
  





}

