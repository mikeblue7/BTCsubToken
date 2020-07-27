const DataOracle = artifacts.require("./DataOracle.sol");

module.exports = function(deployer) {
  deployer.deploy(DataOracle);
};
