import compileResult from "../config/contract.json"
import address from "../config/address.json"

const platform =  compileResult['Platform'];
const abi = platform.abi;

function Platform(web3) {
    return new web3.eth.Contract(
        abi, 
        address.platform);
} 

export default Platform;