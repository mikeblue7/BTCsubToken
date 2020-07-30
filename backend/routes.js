const express = require('express');
var contract = require("@truffle/contract");
const router = new express.Router();
var CryptoJS = require("crypto-js");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
var solc = require("solc");
const EthereumTx = require("ethereumjs-tx");
const Key = require('./config')
const simpleStorageInterface = require("../build/contracts/BitcoinPrice.json");
const PriceInfo = require("../backend/model/price");

var privateKey = new Buffer(Key.privateKey, 'hex')
var privateKey1 = new Buffer(Key.privateKey1, 'hex')
var privateKey2 = new Buffer(Key.privateKey2, 'hex')
var privateKey3 = new Buffer(Key.privateKey3, 'hex')

var Web3 = require("web3");
// //set url of node as provider
var web3;
if (typeof web3 !== "undefined") {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/0f333401437149e28c3696b36eb02f93"));
  web3.eth.net.getPeerCount().then(console.log);
}
// check the current block number and network type
web3.eth.getBlockNumber().then(console.log);
web3.eth.net.getNetworkType()
  .then(console.log);

  router.post("/retrieveBitcoinPrice", (req, res) => {
    web3.eth.defaultAccount = Key.fromAddress;
  
    web3.eth.getTransactionCount(web3.eth.defaultAccount, (err, txCount) => {
      var contractInstance = new web3.eth.Contract(
        Key.interface,
        Key.contractAddress
      );
      let encodedABI = contractInstance.methods.retrieveBitcoinPrice().encodeABI();
  
      let rawTx = {
        nonce: web3.utils.toHex(txCount),
        from: web3.eth.defaultAccount,
        to: Key.contractAddress,
        gasLimit: '0x3d0900',
        gasPrice: web3.utils.toHex(web3.utils.toWei('300', 'gwei')),
        chainId: '0x04',
        data: encodedABI,
        value: web3.utils.toHex(web3.utils.toWei('0.1', 'ether'))
      };
  
      var tx = new EthereumTx(rawTx, { 'chain': 'rinkeby' });
      tx.sign(privateKey);
      var serializedTx = tx.serialize();
  
      web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        if (err) {
          res.status(500).json({ Body: err })
        } else {
          res.status(200).json({ Body: hash })
        }

       
      });
    })
  });

  router.get("/price", (req, res) => {
    web3.eth.defaultAccount = Key.fromAddress;
    var contractInstance = new web3.eth.Contract(
      Key.interface, Key.contractAddress, {
      from: web3.eth.defaultAccount,
      gasPrice: "0"
    }
    );
    try {
      contractInstance.methods.result().call().then(async result => {        
        var price = new PriceInfo({ btcprice : result})
        const data = await price.save();  
        var v1 = await PriceInfo.find()
        .limit(2)
        .sort({ "_id": -1 })        
        const resultToInt = parseInt(result)
        // console.log("v1---",typeof (v1[1].btcprice), "result",typeof resultToInt )
        var variance = (resultToInt - v1[1].btcprice)/v1[1].btcprice*100.00;        
        res.status(200).json({ CuurentBtcPrice: resultToInt, Variance :variance  })        
      })
    } catch (e) {
      res.status(500).json({ Body: e })
    }
  });


module.exports = router;