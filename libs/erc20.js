import compileResult from "../config/contract.json"

const token =  compileResult['YToken'];
const abi = token.abi;

export default function Token(web3,address) {
    return new web3.eth.Contract(
        abi, 
        address);
} 

