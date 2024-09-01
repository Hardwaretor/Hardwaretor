
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("HAW", (m) => {
  // We deploy the factory first
  const HAW = m.contract("HAW");

  return {
    HAW
  };
});