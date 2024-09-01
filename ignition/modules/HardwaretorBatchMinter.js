
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("HardwaretorBatchMinter", (m) => {
  // We deploy the factory first
  const HardwaretorBatchMinter = m.contract("HardwaretorBatchMinter");

  return {
    HardwaretorBatchMinter
  };
});