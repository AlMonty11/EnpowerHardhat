const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Dirección del contrato desplegado (la que recibiste después del despliegue)
  const contractAddress = "0x345cA3e014Aaf5dcA488057592ee47305D9B3e10";  // Cambia esto con tu dirección

  // ABI y bytecode del contrato
  const campaignFactoryAbi = [
    {"inputs":[{"internalType":"uint256","name":"minimum","type":"uint256"}],"name":"createCampaign","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"deployedCampaigns","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDeployedCampaigns","outputs":[{"internalType":"address payable[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"}
  ];

  const factoryContract = new ethers.Contract(contractAddress, campaignFactoryAbi, deployer);

  // Ver los contratos desplegados (usando la función 'getDeployedCampaigns' del contrato)
  const deployedCampaigns = await factoryContract.getDeployedCampaigns();
  console.log("Deployed campaigns:", deployedCampaigns);

  // Si tienes otros métodos en el contrato, puedes llamarlos de manera similar
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
