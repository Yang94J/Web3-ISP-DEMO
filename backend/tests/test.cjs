const path = require('path');
const assert = require('assert');
// using ganache-cli instead of ganache
const ganache = require('ganache-cli');
const Web3 = require('web3');
const BigNumber = require('bignumber.js');

// const compileResult = require("../scripts/compile");
filePath = path.resolve(__dirname,"../../config","contract.json");
const compileResult = require(filePath);
console.log("loading compile result successful...");

const platformCode = compileResult['Platform'];
const YTokenCode = compileResult['YToken'];

const web3 = new Web3(ganache.provider());

let accounts;
let platform;
let token;

/**
 * Test prerequisite. 
 * Set up platform, 
 */
async function init() {
    accounts = await web3.eth.getAccounts();
    console.log(accounts);
    
    platform =  await new web3.eth.Contract(platformCode.abi)
                    .deploy({
                        data : platformCode.evm.bytecode.object,
                        arguments: ["platform"]
                    })
                    .send({
                        from : accounts[0],
                        gas : 6721975
                    });
    
    token =  await new web3.eth.Contract(YTokenCode.abi)
                    .deploy({
                        data : YTokenCode.evm.bytecode.object,
                        arguments: [50,"YYY","Y"]
                    })
                    .send({
                        from : accounts[0],
                        gas : 6721975
                    });

    console.log("platform addr " + platform._address);
    console.log("token addr " + token._address);
    
}


// starting test, when we init one blockchain for all tests, 
// they will share the same status of network, so we can pass on test down.
describe("Platform Testing", async ()=>{

    before(async ()=> {
        await init();
    })

    it("ownerCheckTest",async ()=>{
        assert.equal(await platform.methods.owner().call(),accounts[0]);
    })

    it("ownerTransferTest",async() => {
        await platform.methods.transferOwnership(accounts[1]).send({from:accounts[0]});
        assert.equal(await platform.methods.owner().call(),accounts[1]);
        await platform.methods.transferOwnership(accounts[0]).send({from:accounts[1]});
        assert.equal(await platform.methods.owner().call(),accounts[0]);
    })


    it("erc20TransferTest",async()=>{
        await token.methods.transfer(accounts[1],2).send({from:accounts[0]});
        await token.methods.transfer(accounts[2],46).send({from:accounts[0]});
        await token.methods.transfer(accounts[3],2).send({from:accounts[0]});
        assert.equal(await token.methods.balanceOf(accounts[0]).call(),0);
        assert.equal(await token.methods.balanceOf(accounts[1]).call(),2);
        assert.equal(await token.methods.balanceOf(accounts[2]).call(),46);
        assert.equal(await token.methods.balanceOf(accounts[3]).call(),2);

    })

    it("erc20ApproveTest",async()=>{
        await token.methods.approve(platform.options.address,50).send({from:accounts[1]});
        await token.methods.approve(platform.options.address,50).send({from:accounts[2]});
        await token.methods.approve(platform.options.address,50).send({from:accounts[3]});
        assert.equal(await token.methods.allowance(accounts[1],platform.options.address).call(),50);
        assert.equal(await token.methods.allowance(accounts[2],platform.options.address).call(),50);
        assert.equal(await token.methods.allowance(accounts[3],platform.options.address).call(),50);
    })

    it("userRegisterTest",async()=>{
        await platform.methods.userRegister("accounts1").send({from:accounts[1],gas:300000});
        await platform.methods.userRegister("accounts2").send({from:accounts[2],gas:300000});
        await platform.methods.userRegister("accounts3").send({from:accounts[3],gas:300000});
        assert.equal(await platform.methods.userNum().call(),0);
        assert.equal(await platform.methods.validUserNum().call(),0);
        assert.equal((await platform.methods.getUserApplication().call()).length,3);
        assert.equal((await platform.methods.getUserApplication().call())[0],accounts[1]);
    })

    it("userApproveTest",async()=>{
        await platform.methods.approveUserRegister(0,accounts[1],true).send({from:accounts[0],gas:300000});
        await platform.methods.approveUserRegister(0,accounts[3],false).send({from:accounts[0],gas:300000});
        await platform.methods.approveUserRegister(0,accounts[2],true).send({from:accounts[0],gas:300000});
        assert.equal(await platform.methods.userNum().call(),2);
        assert.equal(await platform.methods.validUserNum().call(),2);
        await platform.methods.userRegister("accounts3").send({from:accounts[3],gas:300000});
        await platform.methods.approveUserRegister(0,accounts[3],true).send({from:accounts[0],gas:300000});
        assert.equal(await platform.methods.userNum().call(),3);
        assert.equal(await platform.methods.validUserNum().call(),3);
    })

    it("devTest",async()=>{
        await platform.methods.devRegister().send({from:accounts[1]});
        assert.equal(await platform.methods.devNum().call(),0);
        assert.equal(await platform.methods.validDevNum().call(),0);
        assert.equal((await platform.methods.getDevApplication().call()).length,1);
        assert.equal((await platform.methods.getDevApplication().call())[0],accounts[1]);
        await platform.methods.approveDevRegister(0,accounts[1],false).send({from:accounts[0],gas:300000});
        assert.equal(await platform.methods.devNum().call(),0);
        assert.equal(await platform.methods.validDevNum().call(),0);
        await platform.methods.devRegister().send({from:accounts[1]});
        await platform.methods.approveDevRegister(0,accounts[1],true).send({from:accounts[0],gas:300000});
        assert.equal(await platform.methods.devNum().call(),1);
        assert.equal(await platform.methods.validDevNum().call(),1);
        await platform.methods.devRegister().send({from:accounts[2]});
        await platform.methods.approveDevRegister(0,accounts[2],true).send({from:accounts[0],gas:300000});
        assert.equal(await platform.methods.devNum().call(),2);
        assert.equal(await platform.methods.validDevNum().call(),2);
    })

    it("projectCreateTest",async ()=>{
        await platform.methods.projectRegister
        (accounts[1],"proj1","1",true,accounts[1],4,1111).send({from:accounts[1],gas:300000});
        await platform.methods.projectSubmit(accounts[1]).send({from:accounts[1],gas:300000});
        await platform.methods.projectRegister
        (accounts[2],"proj2","2",false,token.options.address,4,1111).send({from:accounts[2],gas:300000});
        await platform.methods.projectSubmit(accounts[2]).send({from:accounts[2],gas:300000});
        assert.equal(await platform.methods.projNum().call(),0);
        assert.equal((await platform.methods.getProjApplication().call()).length,2);
        assert.equal((await platform.methods.getProjApplication().call())[0],accounts[1]);
    })

    it("projectApproveTest",async()=>{
        // high gas required
        await platform.methods.projectApprove(0,accounts[1],true).send({from:accounts[0],gas:1800000});
        await platform.methods.projectApprove(0,accounts[2],false).send({from:accounts[0],gas:1800000});
        assert.equal(await platform.methods.projNum().call(),1);
        assert.equal(await platform.methods.validProjNum().call(),1);
        await platform.methods.projectRegister
        (accounts[2],"proj2","2",false,token.options.address,4,1111).send({from:accounts[2],gas:300000});
        await platform.methods.projectSubmit(accounts[2]).send({from:accounts[2],gas:300000});
        await platform.methods.projectApprove(0,accounts[2],true).send({from:accounts[0],gas:1800000});
        assert.equal(await platform.methods.projNum().call(),2);
        assert.equal(await platform.methods.validProjNum().call(),2);
    })

    it("ethProjectTest",async()=>{
        await platform.methods.donate(accounts[1],1,"").send({from:accounts[2],gas:1000000,value:1});
        await platform.methods.donate(accounts[1],2,"").send({from:accounts[3],gas:1000000,value:2});
        const value = new BigNumber(await web3.eth.getBalance(accounts[2]));
        const reflectionValue = new BigNumber(30000000000);
        await platform.methods.reflection(accounts[1],reflectionValue).send({from:accounts[1],gas:300000,value:reflectionValue});
        assert.equal((await platform.methods.projAddr2ProjFundingMapping(accounts[1]).call()).reflectionAmount,reflectionValue);
        const value2 = new BigNumber(await web3.eth.getBalance(accounts[2]));
        assert.equal(value2.minus(value).toString(),reflectionValue.dividedBy(3).toString());
        const index = await platform.methods.proj2DonationInd(accounts[1],1).call();
        const donation = await platform.methods.donations(index).call();
        assert.equal(new BigNumber(donation.reflection).toString(),reflectionValue.times(2).dividedBy(3).toString());
    })

    it("erc20ProjectTest",async()=>{
        await platform.methods.donate(accounts[2],2,"").send({from:accounts[1],gas:1000000});
        await platform.methods.donate(accounts[2],1,"").send({from:accounts[3],gas:1000000});
        const value = new BigNumber(await token.methods.balanceOf(accounts[1]).call());
        const reflectionValue = new BigNumber(45);
        await platform.methods.reflection(accounts[2],reflectionValue).send({from:accounts[2],gas:300000});
        assert.equal((await platform.methods.projAddr2ProjFundingMapping(accounts[2]).call()).reflectionAmount,reflectionValue);
        const value2 = new BigNumber(await token.methods.balanceOf(accounts[1]).call());
        assert(value2.minus(value).toString(),reflectionValue.times(2).dividedBy(3).toString());
        const index = await platform.methods.proj2DonationInd(accounts[2],1).call();
        const donation = await platform.methods.donations(index).call();
        assert.equal(new BigNumber(donation.reflection).toString(),reflectionValue.times(1).dividedBy(3).toString());
    })

});
