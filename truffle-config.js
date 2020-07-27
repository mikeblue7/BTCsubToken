
const HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "myth rule neither chimney crawl surge nest spot accuse frame apart pyramid";
module.exports = {
 

  networks: {   
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8593,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    rinkeby: {
      provider: function() { 
       return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/0f333401437149e28c3696b36eb02f93");
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
  }
 },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.0",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}
