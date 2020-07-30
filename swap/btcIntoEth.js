const renJS = new RenJS("testnet"); // or "chaosnet"
const web3 = new Web3("https://kovan.infura.io/v3/0f333401437149e28c3696b36eb02f93");

const amount = 0.001;

const lockAndMint = renJS.lockAndMint({
    sendToken: "BTC", // Bridge BTC to Ethereum
    sendAmount: RenJS.utils.value(amount, "btc").sats(), // Amount of BTC
    sendTo: "0xe520ec7e6C0D2A4f44033E2cC8ab641cb80F5176", // Recipient Ethereum address
});

const gatewayAddress = lockAndMint.addr();
console.log(`Deposit ${amount} BTC to ${gatewayAddress}`);

lockAndMint.waitAndSubmit(web3.currentProvider, 0 /* confirmations */)
    .then(console.log)
    .catch(console.error);



// btc details
// 1DU3Yy8nWPuFTFg9TDiksSTeA2XpskiPBq
// KzVuPGX7v7N2cv2pw5J8VLDVt6p1r699emctEDJp8CAYweSPKpku