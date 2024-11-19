import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    hardhat: {
      chainId: 1337,  // Red local de Hardhat
    },
    ganache: {
      url: "http://localhost:8545",
      accounts:{
        mnemonic: "helmet badge wide bicycle address call upgrade fog wine father pencil scheme", // Tu mnemónica de Ganache
      }
    }
  }
};

export default config;
