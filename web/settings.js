//Our private Key
var prvtkey = '0x12572bd989563280117df618b15366be46affbd44b7cd53e42ecf65818188d0b';
//Wallet to get info from
var source = '0x04d45Fc663e5bB101607e6fb74B26A920ae579A0';
//Wallet to send to
var address:Array<string> = [];
//Token Address
var contractAddress = '0xABBCc5B730964Fa126A7DF3FCE43D28cB2B9B359';
var erc20token = "0x884401B5608A8309DF1255E95734DD56FC815B35";
//Amount per token
var amount:Array<number> = [];
// gass limit
var gasslimit = new web3.utils.BN("3150151");
//gass price                       8003898
console.log(web3.utils.fromWei(gasslimit,"ether"));

var gassPrice = new web3.utils.BN("21000000000");