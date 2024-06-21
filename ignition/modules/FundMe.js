const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FundME", (m) => {

  const fundMe = m.contract("FundMe", []);

  return { fundMe };
});
