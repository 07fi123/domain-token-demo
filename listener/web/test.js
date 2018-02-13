var Web3 = require('web3');
var loadJsonfile = require("load-json-file");
var async = require('async');

var web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.0.188:8546"));

var contractAddress = "0x986d72c1c76fa9f2ca642463dc3905daba4f0e70"
var abi = loadJsonfile.sync("contracts/Domain.json");
var contract = new web3.eth.Contract(abi.abi, contractAddress);





/*
async.series([
function(callback){
    contract.getPastEvents("Registerd",{fromBlock: 0},function(stuff){
     for(thing in stuff){
         object.push({
            domain: web3.utils.hexToString(stuff[thing].returnValues.domain),
            endpoint: '',
            blockNumber: stuff[thing].blockNumber
            
            });
        
        }
        callback();
    })
},
function(callback){
    contract.getPastEvents("EndPointSet",{fromBlock: 0}).then(function(stuff){
        for(thing in object){
            for(item in stuff){
                if(object[thing].domain == stuff[item].domain){
                    object[thing].endpoint = stuff[item].endpoint;
                }
            }
        }
        console.log(object)
        callback()
    });

}],function(err){
    if (err) return next(err);
    console.log(object);
});
*/