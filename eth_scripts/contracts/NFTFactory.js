const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("NFTFactory", (m) => {
  // We deploy the factory first
  const NFTFactory = m.contract("NFTFactory");

  // Import the NFT contract
  NFT = require("./NFT.js");
  NFT = m.contract("NFT");

  return {
    NFTFactory,
    NFT,
  };
});
