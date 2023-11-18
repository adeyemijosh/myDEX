const dex = artifacts.require("dex");

module.exports = function (deployer) {
    deployer.deploy(dex);
};