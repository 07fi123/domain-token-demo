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
    //console.log(madesql);
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
    //console.log(madesql);
    return madesql;
};
function deleteRows(table,colum,data){
    var sql = "DELETE FROM ?? WHERE ??=?";
    var inserts = [table,colum,data];
    var madesql = mysql.format(sql, inserts);
    //console.log(madesql);
    return madesql;
};
function updateA(table,content,domain){
    var sql = "UPDATE "+table.toString()+" SET content=? WHERE name=? AND type='A'";
    var inserts = [content,domain];
    var madesql = mysql.format(sql, inserts);
    //console.log(madesql);
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
        if(stuff.endpoint){
            connection.query(constructA(id,stuff.domain,stuff.endpoint), function (error, results, fields) {
                connection.release();
                if (error) throw error;
                //console.log(results);
              });
        }else{
        connection.query(constructA(id,stuff.domain,"132.148.143.0"), function (error, results, fields) {
            connection.release();
            if (error) throw error;
            //console.log(results);
          });
        }
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

var contractAddress = "0x41b5bbdf7730a3b47d42a221dc6bd4f2c3759230"
var abi = loadJsonfile.sync("contracts/Domain.json");
var contract = new web3.eth.Contract(abi.abi, contractAddress);

var Events$ = {
    run: function () {
        console.log('ok');
        Events$.one();
    },
    one: function () {
        contract.getPastEvents("Registerd",{fromBlock: 0}).then(function(stuff){
            for(i in stuff){
                Events$.Records.push({domain: web3.utils.hexToUtf8(stuff[i].returnValues.domain),
                    blockNumber: stuff[i].blockNumber
                    })
            }
            Events$.two(stuff);
        });
    },
    two: function (registerdDomains) {
        contract.getPastEvents("EndPointSet",{fromBlock: 0}).then(function(endpoints){
            for(i in Events$.Records){
                for(n in endpoints){
                if(Events$.Records[i].domain == web3.utils.hexToUtf8(endpoints[n].returnValues.domain)){
                        Events$.Records[i].endpoint = web3.utils.hexToUtf8(endpoints[n].returnValues.endpoint)
                        }
                    }
                }
                Events$.register()
            }
        )},

    register: function(){
        for(i in Events$.Records){
            Registerd({
                domain: Events$.Records[i].domain,
                blockNumber: Events$.Records[i].blockNumber,
                endpoint: Events$.Records[i].endpoint
            });
        }
    },

    Records: [],

}
Events$.run();
   
        





/*
event Transfer(bytes32 domain, address newOwner);
event EndPointSet(bytes32 domain,bytes32 endpoint);
event Registerd(bytes32 domain,address newOwner);
event ProtocalSet(bytes32 domain, string newProtocal);
*/


contract.events.Registerd({
        toBlock: "latest"
    }).on('data', function(data){ 
        console.log(data.returnValues.domain)
        Registerd({
        domain: web3.utils.hexToUtf8(data.returnValues.domain.toString()),
        blockNumber: data.blockNumber
    })

});

contract.events.EndPointSet({
        toBlock: "latest"
    }).on('data', function(data){ EndPointSet({
        domain: web3.utils.hexToUtf8(data.returnValues.domain),
        endpoint: web3.utils.hexToUtf8(data.returnValues.endpoint),
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