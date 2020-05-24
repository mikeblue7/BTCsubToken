const BTCsubToken = artifacts.require("BTCsubToken");

module.exports = function(deployer) {
  deployer.deploy(BTCsubToken, 1000000000);
};
