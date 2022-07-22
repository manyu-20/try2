const  express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');

const keythereum = require("keythereum");
const MyContract = require('./myContract3.json');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

/* HOME PAGE */
app.get('/', (req,res) => {
	    res.send("Hello world");
})

/* Redirecting Get Page */ 
app.get('/getData', (req,res) => {
	            res.redirect("/getData/0");
})

/* GET PAGE */
app.get('/getData/:num', async (req,res) => {
	    let input = 0;
		console.log("reading");
	    /* Check whether params are invalid */
	    if(isNaN(req.params.num)){
		            res.redirect("/invalid");
		        }
	    /* Parsing input value to Integer */
	    input = parseInt(req.params.num);
	    /* Chaeck wheter input is either 0 or 1 */
	    if(input != 0 && input != 1){
		            res.redirect("/invalid");
		        }

	    try{
		            /* Calling Read Data function*/
		           const result = await readData(input);
		   // const result = "hello";
		            /* Sending result Data */
		            res.send(result);
		            }
	    catch(error){
		            console.log(error);
		        }
	    finally{
		            console.log("Get Data function called!");
		        }
});


/* INVALID PAGE */
app.get("/invalid" , (req,res) => {
	    res.send("404");
})

app.post('/addData', async (req,res) =>{
	    try {
		                
		                if(req.headers['x-api-key'] === undefined || req.headers['x-api-key'] != "a799363f-1c41-4df5-9648-daaea2bbeffb")
			        return res.send({msg: "Goodbye"});

		                sensor_id = parseInt(req.body.sensor_id);
		                area_id = parseInt(req.body.area_id);
		                location_id = parseInt(req.body.location_id);
		                bid = parseInt(req.body.bid);
		                time = req.body.time;
		                date = req.body.date;
		                sensorType = parseInt(req.body.sensorType);
		                sensorData = parseInt(req.body.sensorData);



		                dict = {
					                "sensor_id" : sensor_id,
					                "area_id" : area_id,
					                "location_id" : location_id,
					                "bid" : bid,
					                "time" : time,
					                "date" : date,
					                "sensorType" : sensorType,
					                "sensorData" : sensorData
					            }

		                
		                const done = await writeData(dict,res);
		               // res.send("200");
		    		
		        }
	    catch(error){
		                       console.log(error);
		        }
	   finally{
		           console.log("POST DATA RECIEVED");
		       }

})



/* PORT IS LISTENING */
app.listen(PORT, () => console.log("server is running at 5000"));


/* Read data function */

const readData = async (num) => {
	    const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545"));
	    input = parseInt(num);
	    try{
		        /* Get network ID */
		        const id = await web3.eth.net.getId();
		        /* Get Deployed Network */
		        const deployedNetwork = MyContract.networks[id]; 
		        console.log(deployedNetwork.address);
		        /* Get Contract Instance */
		        const contract = new web3.eth.Contract(MyContract.abi,deployedNetwork.address);
		        /* Calling read function */
		        const result = await contract.methods.read(input).call();
		   

		            if(!result){
				            return [];
				        }
		        sensorMapper = {
				        "0" : "Temperature",
				        "1" : "Air-Humidity",
				        "2" : "Soil-Moisture",
				        "3" : "AQI",
				        "4" : "PH",
				    };

		        /* Putting values inside an Array of Dictionaries */
		        let data = [];
		        for(let i = 0;i<result.length;i++){
				        data.push({
						            id : parseInt( result[i][0]),
						            sensor_id : parseInt( result[i][1]),
						            area_id : parseInt( result[i][2]),
						            location_id : parseInt( result[i][3]),
						            batch_id : parseInt( result[i][4]),
						            time: result[i][5],
						            date : result[i][6],
						            sensor_name : sensorMapper[result[i][7]],
						            sensor_type : parseInt( result[i][7]),
						            sensor_reading : parseInt( result[i][8]),
						            isOut : result[i][9]
						        });
				    }
		        return data;
		       }
	   catch(error){
		       console.log(error);
		      }
	   finally {
		       console.log("write function executed");
		      }
}

/* Unlock Account function */
const unlockAccount = async () =>{
	    /* web3 initialization */
	    const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545"));

	    try{
		            const reciept = await web3.eth.personal.unlockAccount("0x2557a05492342845c49320796647419bfd63a45d", "", 3000);
		            console.log(reciept);
		        }
	    catch(error){
		            console.log(error);
		        }
	    finally{
		            console.log("Unlock Account function called!");
		        }

}

/* Write data function */
const writeData = async (dict,res) => {
	    const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545")); 
	    try {
		   /* const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545"));
		     const unlock = await unlockAccount();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MyContract.networks[networkId];
        const myContract = new web3.eth.Contract(MyContract.abi,deployedNetwork.address);
        const privateKey = "840e0e2729e7e2c543d04a3de9bac5218bd19ba41aa59cce13abba222cb0b5e2";
	const addresses = "0x2557a05492342845c49320796647419bfd63a45d";
        const tx = myContract.methods.add(
            dict["bid"],
            dict["sensor_id"],
            dict["area_id"],
            dict["location_id"],
            dict["time"],
            dict["date"],
            dict["sensorType"],
            dict["sensorData"],
        );
        
        const gas = await tx.estimateGas({from: addresses});
		    console.log("gas = " + gas);
        const gasPrice = await web3.eth.getGasPrice();
		    console.log("gas price = " + gasPrice);
        const data = tx.encodeABI();
        const nonce = await web3.eth.getTransactionCount(addresses);

        const signedTx = await web3.eth.accounts.signTransaction({
            to: myContract.options.address,
            data,
            gas,
            gasPrice,
            nonce,
            chainId: networkId
        },
            privateKey
        );
	console.log(signedTx);
	const raw = signedTx.rawTransaction.toString();
	console.log("raw = " + raw);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(receipt.transactionHash); */
		            const id = await web3.eth.net.getId();
		    	    console.log("id = " + id);
		            const deployedNetwork = MyContract.networks[id];
		            console.dir("deployed networ = " + deployedNetwork);
		            const contract = new web3.eth.Contract(MyContract.abi,deployedNetwork.address);
		            const addresses = await web3.eth.getAccounts();
		            console.log(addresses);
		            const unlock = await unlockAccount();
		    	    contract.methods.add(
                                               dict["bid"],
                                                dict["sensor_id"],
                                                dict["area_id"],
                                                dict["location_id"],
                                                dict["time"],
                                                dict["date"],
                                                dict["sensorType"],
                                                dict["sensorData"],

                                            ).send({from : addresses[0]})
		            .once('sending', function(payload){ console.log(payload); })
.once('sent', function(payload){ console.log(payload); })
.once('transactionHash', function(hash){ console.log(hash); })
.once('receipt', function(receipt){ console.log(receipt); })
.on('confirmation', function(confNumber, receipt, latestBlockHash){  })
.on('error', function(error){ console.log(error); })
.then(function(receipt){
    console.log("mined");
	res.send("200");
});
		    
		            /* const reciept = await contract.methods.add(
				               dict["bid"],
				                dict["sensor_id"],
				                dict["area_id"],
				                dict["location_id"],
				                dict["time"],
				                dict["date"],
				                dict["sensorType"],
				                dict["sensorData"],

				            ).send({from : addresses[0]});
		            
		            console.dir(reciept); */

		        }
	    catch(error) {
		            console.log(error);
		        }
	    finally {
		            console.log("Write function called!");
		        }

}
