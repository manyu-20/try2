var myContract3 = artifacts.require("./myContract3.sol");
module.exports = function(deployer) {
	   deployer.deploy(myContract3);
};
