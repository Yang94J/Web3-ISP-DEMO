const path = require('path');

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
require('dotenv').config()

// deploy to Goe ETH testnet
const rpcUrl = process.env.ethGRpcUrl;
const privateKey = process.env.ethGPrivateKey;

console.log(rpcUrl)
console.log(privateKey)

// deploy to Ganache ETH testnet
// const rpcUrl = process.env.localRpcUrl;
// const privateKey = process.env.localPrivateKey;

const provider  = new HDWalletProvider(privateKey,rpcUrl);

const web3 = new Web3(provider);
console.log(web3);

filePath = path.resolve(__dirname,"../../config","contract.json");
const compileResult = require(filePath);

const platform = compileResult['Platform'];

const abi = platform.abi;
const bytecode = platform.evm.bytecode.object;

// console.log(abi);
// console.log(bytecode);


async function deploy(){
    const accounts =  await web3.eth.getAccounts();
    console.log(accounts);
    console.log("deploying using "+ accounts[0]);
    console.time("deploy")

    web3.eth.getGasPrice().then((gasPrice) => {
        console.log(`Current gas price: ${gasPrice}`);
      }).catch((error) => {
        console.error(error);
      });

    let contract;
    try{
        contract = await new web3.eth.Contract(abi)
        .deploy({
            data : bytecode,
            arguments: ['YoungPlatform']
        })
        .send({
            from : accounts[0],
            gas : 6721975
        });
    }catch (error){
        console.log(error);
    }

    console.timeEnd("deploy")
    console.log("deploy success : "+ contract.options.address);
    provider.engine.stop();
}

deploy();