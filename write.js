const Web3 = require('web3');
const MyContract = require('./truffle/build/contracts/myContract.json');

const init = async () => {
	            const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545"));

	            const id = await web3.eth.net.getId();
	            const deployedNetwork = MyContract.networks[id];
	            const contract = new web3.eth.Contract(
			                                MyContract.abi,
			                                deployedNetwork.address
			                            );

	            const addresses = await web3.eth.getAccounts();

	           contract.methods.add(1,"20-12-2022",2,600).send({from: addresses[0],},
		   ).then((receipt) => console.log(receipt));

	            console.log(addresses);


}

init();
