var Web3 = require('web3');
var loadJsonfile = require("load-json-file");
var fs = require("fs");
var BN = require("bn.js");
global.debug = false;
// Set the ethereum provider 
var provider = "https://rinkeby.infura.io/NtYoKkfvdD1zQtoHJUNa/v1/";

var web3 = new Web3(provider);
var contractAddress = "0x986d72c1c76fa9f2ca642463dc3905daba4f0e70"
var abi = loadJsonfile.sync("contracts/DomainToken.json");
var contract = new web3.eth.Contract(abi.abi, contractAddress);
var callABI = contract.methods.register(web3.utils.toHex("mitch.dom")).encodeABI();
console.log(callABI);

function GenerateTransaction(account, contractAddress, gasslimit, gassPrice, callABI, n) {
    var transactionObj = {
        from: account,
        to: contractAddress,
        gasLimit: web3.utils.toHex(gasslimit),
        gasPrice: web3.utils.toHex(gassPrice),
        value: "0x00",
        data: callABI,
        nonce: web3.utils.toHex(n.toString())
    };
    if (global.debug == true) {
        console.log(transactionObj);
    }
    return transactionObj;
}
exports.GenerateTransaction = GenerateTransaction;
;
//Sign and send transactions
function signAndSend(transactionObj, prvtkey) {
    web3.eth.accounts.signTransaction(transactionObj, prvtkey).then(function (tx) {
        web3.eth.sendSignedTransaction(tx.rawTransaction)
            .on('error', console.log)
            .on('transactionHash', function (data) { return console.log(data); });
    });
}
exports.signAndSend = signAndSend;
;
/* Generate Transaction LIst
export function generateTransactionList(walletfrom,walletto,tokaddress,amount,gasslimit,gassPrice,n){
    var transactionArray = [];
    for(var i=0; i < n; i++){
        transactionArray[i] = GenerateTransaction(walletfrom,walletto,tokaddress,amount,gasslimit,gassPrice,i+n);
    };
    return transactionArray;
};
*/

//Our private Key
var prvtkey = '0x12572bd989563280117df618b15366be46affbd44b7cd53e42ecf65818188d0b';
//Wallet to get info from
var account = '0x04d45Fc663e5bB101607e6fb74B26A920ae579A0';
//Wallet to send to
//Token Address
var contractAddress = '0x986d72c1c76fa9f2ca642463dc3905daba4f0e70';
//Amount per token
// gass limit
var gasslimit = new web3.utils.BN("2501510");
//gass price                       8003898
var gassPrice = new web3.utils.BN("21000000000");
console.log(web3.utils.fromWei(gasslimit,"ether"));
console.log(web3.utils.fromWei(gassPrice,"gwei"));


/*

for(var i =0; i <= address.length; i+= 150){
    if(i+150>address.length){
        console.log(i +","+(address.length));
    }else{
        console.log(i +","+(i + 150))
    }
};
*/



web3.eth.getTransactionCount(account)
    .then(function (n) {
        console.log(n);
        var n = new BN(n.toString());
        var number = n.toNumber();
        console.log(account, contractAddress, gasslimit, gassPrice, callABI, number);
        signAndSend(GenerateTransaction(account, contractAddress, gasslimit, gassPrice, callABI, number), prvtkey);
});


