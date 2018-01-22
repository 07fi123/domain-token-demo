var Web3 = require('web3');
var loadJsonfile = require("load-json-file");


// Set the ethereum provider 
//var provider = "http://rinkeby.infura.io/NtYoKkfvdD1zQtoHJUNa/v1/";
var web3 = new Web3(new Web3.providers.WebsocketProvider("http://192.168.0.188:8545"));

var contractAddress = "0x986d72c1c76fa9f2ca642463dc3905daba4f0e70"
var abi = loadJsonfile.sync("contracts/Domain.json");
var contract = new web3.eth.Contract(abi.abi, contractAddress);


contract.events.Registerd({
        toBlock: "latest"
    }).on('data', function(stuff){
        console.log(stuff);
    });

//contract.getPastEvents("allEvents",{fromBlock: 0,to:"latest"}).then(console.log);

