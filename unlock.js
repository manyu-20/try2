const Web3 = require('web3');

const init = async () => {

            const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545"));

            
            
            web3.eth.personal.unlockAccount("0x2557a05492342845c49320796647419bfd63a45d", "", 1500)
.then(console.log('Account unlocked!'));
            

            

            console.log("executed");


}

init();
