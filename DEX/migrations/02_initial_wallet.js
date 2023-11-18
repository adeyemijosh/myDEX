const walletContract = artifacts.require("walletContract");

module.exports = function (deployer) {
    deployer.deploy(walletContract);
};
