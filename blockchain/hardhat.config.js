require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.27",
  networks: {
    hardhat: {
      chainId: 1337, // Red local de Hardhat
    },
    ganache: {
      url: "http://localhost:8545",
      accounts: {
        mnemonic: "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat", // Tu mnemónica de Ganache
      },
    },
  },
};

