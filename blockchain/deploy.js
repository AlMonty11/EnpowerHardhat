const Web3 = require('web3');
// import { Web3 } from 'web3';
const HDWalletProvider = require('@truffle/hdwallet-provider');
const compiledFactory = require('./build/CampaignFactory.json'); // Asegúrate de que CampaignFactory.json esté en la carpeta build

// Mnemónica generada por Ganache
const mnemonic = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'; // Cambia a tu mnemónica
const providerUrl = 'http://localhost:8545'; // URL de tu instancia de Ganache

// Crear el proveedor con la mnemónica y la URL de Ganache
const provider = new HDWalletProvider(mnemonic, providerUrl);

// Crear una instancia de Web3 usando el proveedor
const web3 = new Web3(provider);

const deploy = async () => {
  try {
    console.log("Campaign factory: ",compiledFactory);
    // Obtener las cuentas desde Ganache
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account:', accounts[0]);

    // Crear la instancia del contrato con la ABI y el bytecode
    const campaignFactory = new web3.eth.Contract(compiledFactory.abi);

    // Desplegar el contrato
    const result = await campaignFactory
      .deploy({ data: compiledFactory.evm.bytecode.object })
      .send({ from: accounts[0], gas: '2000000' });

    console.log("Contract deployed to:", result.options.address);

    // Opcional: Crear una campaña después del despliegue
    console.log("Creating a new campaign...");
    const createTx = await result.methods.createCampaign(1000).send({ from: accounts[0], gas: '1000000' });
    console.log('Campaign created, transaction hash:', createTx.transactionHash);
  } catch (error) {
    console.error("Deployment error:", error);
  } finally {
    // Detener el proveedor de Web3
    provider.engine.stop();
  }
};

// Llamar a la función de despliegue
deploy();
