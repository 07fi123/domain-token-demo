var Web3 = require('web3');
var loadJsonfile = require("load-json-file");
var async = require('async');


//Mysql Setup
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 15,
  host     : 'localhost',
  user     : 'root',
  password : 'powerdns',
  database : 'powerdns'
});

function selectAll(table,colum,data){
    var sql ="SELECT * FROM ?? WHERE ??=?";
    var inserts = [table,colum,data];
    return mysql.format(sql, inserts);

};

function constructSOA(id,domain){
    var sql = "INSERT INTO records SET\
    domain_id=?,\
    name=?,\
    type=?,\
    content=?,\
    ttl=?,\
    change_date=unix_timestamp();";
    var inserts = [id ,domain,"SOA","ns."+domain.toString()+" noreply."+domain.toString()+" 12719280 172800 900 1209600 3600",600];
    var madesql = mysql.format(sql, inserts);
    console.log(madesql);
    return madesql;
};

function constructA(id,domain, endpoint){
    var sql = "INSERT INTO records SET\
    domain_id=?,\
    name=?,\
    type=?,\
    content=?,\
    ttl=?,\
    change_date=unix_timestamp();";
    var inserts = [id ,domain,"A",endpoint,600];
    var madesql = mysql.format(sql, inserts);
    console.log(madesql);
    return madesql;
};
function deleteRows(table,colum,data){
    var sql = "DELETE FROM ?? WHERE ??=?";
    var inserts = [table,colum,data];
    var madesql = mysql.format(sql, inserts);
    console.log(madesql);
    return madesql;
};
function updateA(table,content,domain){
    var sql = "UPDATE "+table.toString()+" SET content=? WHERE name=? AND type='A'";
    var inserts = [content,domain];
    var madesql = mysql.format(sql, inserts);
    console.log(madesql);
    return madesql;
};

function Registerd(stuff){
    var id = stuff.blockNumber;
    pool.getConnection(function(err, connection){
        connection.query('INSERT INTO domains (name,type,master) VALUES(?,"master","127.0.0.1")',[stuff.domain], function (error, results, fields) {
            connection.release();
            if (error) throw error;
            //console.log(results);
          });
    });
    pool.getConnection(function(err, connection){
        connection.query(constructSOA(id,stuff.domain), function (error, results, fields) {
            connection.release();
            if (error) throw error;
            //console.log(results);
          });
      });
    pool.getConnection(function(err, connection){
        connection.query(constructA(id,stuff.domain,"132.148.143.0"), function (error, results, fields) {
            
            connection.release();
            if (error) throw error;
            //console.log(results);
          });
      });
    };


function EndPointSet(stuff){
        pool.getConnection(function(err, connection){
            connection.query(updateA("records",stuff.endpoint,stuff.domain), function (error, results, fields) {
                
                connection.release();
                if (error) throw error;
                //console.log(results);

              });
            
          });
        };

// Set the ethereum provider 
//var provider = "http://rinkeby.infura.io/NtYoKkfvdD1zQtoHJUNa/v1/";

var web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.0.188:8546"));

var contractAddress = "0x986d72c1c76fa9f2ca642463dc3905daba4f0e70"
var abi = loadJsonfile.sync("contracts/Domain.json");
var contract = new web3.eth.Contract(abi.abi, contractAddress);


    contract.getPastEvents("Registerd",{fromBlock: 0}).then(function(stuff){
        stuff.map(thing => Registerd({
            domain: web3.utils.hexToString(thing.returnValues.domain),
            blockNumber: thing.blockNumber
        }));
    }).then(
    
    contract.getPastEvents("EndPointSet",{fromBlock: 0}).then(function(stuff){
        stuff.map(thing => EndPointSet({
            domain: web3.utils.hexToString(thing.returnValues.domain),
            endpoint: web3.utils.hexToString(thing.returnValues.endpoint),
            blockNumber: thing.blockNumber
        }));
    }));





/*
event Transfer(bytes32 domain, address newOwner);
event EndPointSet(bytes32 domain,bytes32 endpoint);
event Registerd(bytes32 domain,address newOwner);
event ProtocalSet(bytes32 domain, string newProtocal);
*/

console.log('We GET HERE');
contract.events.Registerd({
        toBlock: "latest"
    }).on('data', function(data){ Registerd({
        domain: web3.utils.hexToString(data.returnValues.domain),
        blockNumber: data.blockNumber
    })
});

contract.events.EndPointSet({
        toBlock: "latest"
    }).on('data', function(data){ EndPointSet({
        domain: web3.utils.hexToString(data.returnValues.domain),
        endpoint: web3.utils.hexToString(data.returnValues.endpoint),
        blockNumber: data.blockNumber
    })
});



/*
//contract.getPastEvents("allEvents",{fromBlock: 0,to:"latest"}).then(console.log);
var PowerDnsAuthoritativeHttpApi = require('power_dns_authoritative_http_api');

//Set Power DNS providor
var defaultClient = PowerDnsAuthoritativeHttpApi.ApiClient.instance;
defaultClient.basePath = "http://localhost:8081/api/v1"

// Configure API key authorization: APIKeyHeader
var APIKeyHeader = defaultClient.authentications['APIKeyHeader'];
APIKeyHeader.apiKey = "secret"
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//APIKeyHeader.apiKeyPrefix['X-API-Key'] = "Token"

var api = new PowerDnsAuthoritativeHttpApi.ZonesApi()

var serverId = "localhost"; // {String} The id of the server to retrieve

var callback = function(error, data, response) {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
    }
  };
  
var opts = {
      "account": "",
      "dnssec": false,
      "id": "potato.org.",
      "kind": "Native",
      "last_check": 0,
      "masters": [],
      "name": "potato.org.",
      "notified_serial": 0,
      "serial": 2018012501,
      "url": "/api/v1/servers/localhost/zones/potato.org."
    }

api.createZone(serverId,opts,callback);
*/