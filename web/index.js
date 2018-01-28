var Web3 = require('web3');
var loadJsonfile = require("load-json-file");
var fs = require("fs");
var BN = require("bn.js");
// server.js

// BASE SETUP
// ==============================================

var express = require('express');
var app     = express();
var port    = 	process.env.PORT || 8080;


global.debug = false;
// Set the ethereum provider
var provider = "https://rinkeby.infura.io/NtYoKkfvdD1zQtoHJUNa/v1/";

var web3 = new Web3(provider);
var contractAddress = "0x986d72c1c76fa9f2ca642463dc3905daba4f0e70"
var abi = loadJsonfile.sync("contracts/DomainToken.json");
var contract = new web3.eth.Contract(abi.abi, contractAddress);




// ROUTES
// ==============================================

// sample route with a route the way we're used to seeing it
app.get('/sample', function(req, res) {
	res.send('this is a sample!');
});

// we'll create our routes here

// get an instance of router
var router = express.Router();

// route middleware that will happen on every request
router.use(function(req, res, next) {

	// log each request to the console
	console.log(req.method, req.url);

	// continue doing what we were doing and go to the route
	next();
});

// set the view engine to ejs
app.set('view engine', 'ejs');

// home page route (http://localhost:8080)
router.get('/', function(req, res) {
	res.render('index');
});



// about page route (http://localhost:8080/about)
router.get('/register', function(req, res) {
  console.log(Object.keys(req))
  let domname = req.query.n;
  // let domname = 'qwertyusdsada.dom';

  var callABI = contract.methods.register(web3.utils.toHex(domname)).encodeABI();

  web3.eth.getTransactionCount(account)
      .then(function (n) {
          console.log(n);
          var n = new BN(n.toString());
          var number = n.toNumber();
					var _w3 = { account, contractAddress, gasslimit, gassPrice, callABI, number }

					signAndSend(GenerateTransaction(account, contractAddress, gasslimit, gassPrice, callABI, number), prvtkey);
          res.json(_w3);
  });

});

// route middleware to validate :name
router.param('name', function(req, res, next, name) {
	// do validation on name here
	// blah blah validation
	// log something so we know its working
	console.log('doing name validations on ' + name);

	// once validation is done save the new item in the req
	req.name = name;
	// go to the next thing
	next();
});

// route with parameters (http://localhost:8080/hello/:name)
router.get('/hello/:name', function(req, res) {
	res.send('hello ' + req.name + '!');
});

// apply the routes to our application
app.use('/', router);

// login routes
app.route('/login')

	// show the form (GET http://localhost:8080/login)
	.get(function(req, res) {
		res.send('this is the login form');
	})

	// process the form (POST http://localhost:8080/login)
	.post(function(req, res) {
		console.log('processing');
		res.send('processing the login form!');
	});

// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);


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
cons(callABI);
for(var i =0; i <= address.length; i+= 150){
    if(i+150>address.length){
        console.log(i +","+(address.length));
    }else{
        console.log(i +","+(i + 150))
    }
};
*/



// web3.eth.getTransactionCount(account)
//     .then(function (n) {
//         console.log(n);
//         var n = new BN(n.toString());
//         var number = n.toNumber();
//         console.log(account, contractAddress, gasslimit, gassPrice, callABI, number);
//         signAndSend(GenerateTransaction(account, contractAddress, gasslimit, gassPrice, callABI, number), prvtkey);
// });
