
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("NFT", (m) => {
  // We deploy the factory first
  const NFT = m.contract("NFT");

  return {
    NFT
  };
});