const { Web3 } = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const compiledFactory = require('./build/CampaignFactory.json');  // Asegúrate de que este archivo esté compilado previamente

// Tu mnemónica generada por Ganache
const mnemonic = 'helmet badge wide bicycle address call upgrade fog wine father pencil scheme';  // Cambia esto por tu mnemónica
const providerUrl = 'http://localhost:8545';  // URL de Ganache

// Crear el proveedor con la mnemónica y la URL de Ganache
const provider = new HDWalletProvider(
  mnemonic,  // Mnemónica de Ganache
  providerUrl  // Conexión a Ganache
);

// Crear una instancia de Web3 usando el proveedor
const web3 = new Web3(provider);

const deploy = async () => {
  try {
    // Obtener las cuentas desde Ganache
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account:', accounts[0]);

    // Crear la instancia del contrato con la ABI y bytecode
    const campaignFactory = new web3.eth.Contract(JSON.parse(compiledFactory.interface));

    // Desplegar el contrato
    const result = await campaignFactory
      .deploy({ data: compiledFactory.bytecode })
      .send({ from: accounts[0], gas: '1000000' });

    console.log("Contract deployed to:", result.options.address);

    // Opcional: Crear una campaña después del despliegue
    console.log("Creating a new campaign...");
    const createTx = await result.methods.createCampaign(1000).send({ from: accounts[0], gas: '1000000' });
    console.log('Campaign created, transaction hash:', createTx.transactionHash);

  } catch (error) {
    console.log("Deployment error:", error);
  } finally {
    // Detener el proveedor de Web3 (esto es importante para liberar recursos)
    provider.engine.stop();
  }
};

// Llamar a la función de despliegue
deploy();
