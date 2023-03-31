const fs = require('fs');
const path = require('path');
const solc = require('solc');



const contractFiles = ['Platform.sol','YToken.sol'];
let outputs = {};

// compile all contracts 
contractFiles.forEach(contractFile => {

        console.log("compile contract "+ contractFile +" ......");
        console.time("compiling ")
        const solfile = contractFile;
        const solContractName = solfile.split(".")[0];
        
        const contractPath = path.resolve(__dirname,"../contracts",solfile);
        const contractSource = fs.readFileSync(contractPath,'utf-8');
        var input = {
            language: 'Solidity',
            sources: {
                target : {
                    content: contractSource
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': [ '*' ]
                    }
                },
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }; 

        const result = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
        // console.log(result);
        const output = result.contracts["target"][solContractName]
        const bytecode = output.evm.bytecode.object;
        const bytecodeSize = Buffer.from(bytecode, 'hex').length;
        console.log(`MyContract bytecode size: ${bytecodeSize}`);


        console.timeEnd("compiling ")
        outputs[solContractName] = output;
    }
);

// console.log(outputs);
contractJsonConfigPath = path.resolve(__dirname,"../../config","contract.json");
fs.writeFileSync(contractJsonConfigPath, JSON.stringify(outputs));

// module.exports = outputs;

function findImports(relativePath) {
    //my imported sources are stored under the node_modules folder!
    let absolutePath
    if (relativePath[0]!="@"){
        console.log("importing dependencies from contracts "+relativePath);
        absolutePath = path.resolve(__dirname, '../contracts', relativePath);
    }else{
        console.log("importing dependencies from node_modules "+relativePath);
        absolutePath = path.resolve(__dirname, '../../node_modules', relativePath);
    }
    // const absolutePath = path.resolve(__dirname, '../node_modules', relativePath);
    const source = fs.readFileSync(absolutePath, 'utf8');

    return { contents: source };
}