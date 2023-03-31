// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// inherit 
import "./RegisterCenter.sol";
import "./ShareNFT.sol";

/**
    ProjCenter layer is used for interaction with dev for proj setup
 */
contract ProjCenter is RegisterCenter {

    using SafeMath for uint;

    // Necessary Info for a proj
    struct Proj{
        // project index
        uint projId;
        // project Addr (donation Addr & reflection Addr)
        address projAddr;
        // project name
        string projName;
        // project description
        string projDescription;
        // project owner address (just for control purpose)
        address projOwnerAddress;
        // projState unregistered -> registered -> submitted -> approved -> locked
        State projState;
    }

    // project funding information
    struct ProjFunding{
        // if the project requires eth or erc20 token
        bool requireEth;
        // erc20 token address
        address erc20Address;
        // amount required by project
        uint requireAmount;
        // initTimestamp since the project get approved
        uint initTimestamp;
        // duration for the fund collection
        uint duration;
        // nft identification contract address
        address nftAddress;
        // totalAmount received, this will be used for share compuation
        uint donationAmount;
        // totalReflection given
        uint reflectionAmount;
    }

    // default project Id during application
    uint constant DEFAULT_PROJECT_ID = 99999;


    // project Address => proj struct mapping
    mapping(address => Proj) public projAddr2ProjMapping;
    // project Address => projfunding struct mapping
    mapping(address => ProjFunding) public projAddr2ProjFundingMapping;
    // project ownerAddress to proj address Mapping
    mapping(address => address[]) public ownerAddr2ProjMapping;
    // project index mapping
    mapping(uint => address) public projInd2ProjAddrMapping;

    // project application list
    address[] public projApplicationList;

    // total projects applied
    uint public projNum = 0;
    // total projects approved
    uint public validProjNum = 0;
    // for performance seek, the queue size should not exceed 10
    uint constant MAX_PROJECTS_NUM = 10;

    event projCenter_projRegister(address ownerAddr, address projAddr);
    event projCenter_projLock(address ownerAddr, address projAddr,bool lock);
    event projCenter_projSubmit(address ownerAddr,address projAddr);
    event projCenter_projApprove(address projAddr,bool approved);
    event projCenter_projNFTCreate(address projAddr,address nftAddr);

    // the project state should match
    modifier projStateValid(address projAddr, State state){
        require(projAddr2ProjMapping[projAddr].projState == state, "state invalid");
        _;
    }

    // require ownership of the project
    modifier projectOwnerCheck(address projAddr){
        require(projAddr2ProjMapping[projAddr].projOwnerAddress == msg.sender, "owner required");
        _;
    }

    // dev cant setup too many projects
    modifier userProjectLimitCheck(){
        require(ownerAddr2ProjMapping[msg.sender].length < MAX_PROJECTS_NUM,"dev projects exceeds limit");
        _;
    }


    constructor() RegisterCenter() {
        
    }

    // register project
    function projectRegister(address projAddr, string memory projName, string memory projDescription,
    bool requireEth, address erc20Addr, uint requireAmount, uint duration) external 
        isUserDev(true) 
        projStateValid(projAddr,State.UNREGISTERED)
        userProjectLimitCheck()
    {
        Proj storage userProj = projAddr2ProjMapping[projAddr];
        userProj.projId = DEFAULT_PROJECT_ID;
        userProj.projAddr = projAddr;
        userProj.projName = projName;
        userProj.projDescription = projDescription;
        userProj.projOwnerAddress = msg.sender;
        userProj.projState = State.REGISTERED;


        ProjFunding storage projfund = projAddr2ProjFundingMapping[projAddr];
        projfund.requireEth = requireEth;
        projfund.erc20Address = erc20Addr;
        projfund.requireAmount = requireAmount;
        projfund.duration = duration;

        ownerAddr2ProjMapping[msg.sender].push(projAddr);
        emit projCenter_projRegister(msg.sender,projAddr);
    }

    // lock an approved project by platform owner
    function projectLock(address projAddr) public 
        onlyOwner
        projStateValid(projAddr,State.APPROVED)
    {
        projAddr2ProjMapping[projAddr].projState = State.LOCKED;
        emit projCenter_projLock(projAddr2ProjMapping[projAddr].projOwnerAddress,projAddr,true);
    }

    // unlock an locked project
    function projectUnLock(address projAddr) public 
        onlyOwner
        projStateValid(projAddr,State.LOCKED)
    {
        projAddr2ProjMapping[projAddr].projState = State.APPROVED;
        emit projCenter_projLock(projAddr2ProjMapping[projAddr].projOwnerAddress,projAddr,true);
    }

    // submit project
    function projectSubmit(address projAddr) public 
        projectOwnerCheck(projAddr) 
        projStateValid(projAddr,State.REGISTERED)
        waitingListApplicable(projAddr,projApplicationList) 
    {
        projAddr2ProjMapping[projAddr].projState = State.SUBMIT;
        projApplicationList.push(projAddr);
        emit projCenter_projSubmit(msg.sender,projAddr);
    }

    // approve(or deny) project
    function projectApprove(uint index, address projAddr,bool approved) public 
    onlyOwner() 
    indexCorrectCheck(index,projAddr,projApplicationList)
    projStateValid(projApplicationList[index],State.SUBMIT){
        if (approved){
            projAddr2ProjMapping[projAddr].projState = State.APPROVED;
            projAddr2ProjFundingMapping[projAddr].initTimestamp = block.timestamp;
            postApprove(projAddr,projAddr2ProjMapping[projAddr].projName);

            projAddr2ProjMapping[projAddr].projId = projNum;
            projInd2ProjAddrMapping[projNum] = projAddr;

            projNum = projNum.add(1);
            validProjNum = validProjNum.add(1);
        }else {
            projAddr2ProjMapping[projAddr].projState = State.UNREGISTERED;
            address ownerAddr = projAddr2ProjMapping[projAddr].projOwnerAddress;
            for (uint i = 0; i < ownerAddr2ProjMapping[ownerAddr].length; i++){
                if (ownerAddr2ProjMapping[ownerAddr][i]==projAddr){
                    ownerAddr2ProjMapping[ownerAddr][i] = ownerAddr2ProjMapping[ownerAddr][ownerAddr2ProjMapping[ownerAddr].length-1];
                    ownerAddr2ProjMapping[ownerAddr].pop();
                    break;
                }
            }
        }
        projApplicationList[index] = projApplicationList[projApplicationList.length-1];
        projApplicationList.pop();
        emit projCenter_projApprove(projAddr, approved);
    }

    // after approve, perform nft contract creation..
    function postApprove(address projAddr, string memory projName) internal{
        ShareNFT nft = new ShareNFT(projName,projName);
        projAddr2ProjFundingMapping[projAddr].nftAddress = address(nft);
        emit projCenter_projNFTCreate(projAddr,address(nft));
    }

    // getUserApplicationList
    function getProjApplication() public view returns (address[] memory){
        address[] memory res = new address[](projApplicationList.length);
        for (uint ind = 0; ind < projApplicationList.length; ind++){
            res[ind] = projApplicationList[ind];
        }
        return res;
    }


    function getDevProjList(address devAddr) public view returns (address[] memory){
        address[] memory res = new address[]( ownerAddr2ProjMapping[devAddr].length);
        for (uint ind = 0; ind < ownerAddr2ProjMapping[devAddr].length; ind++){
            res[ind] = ownerAddr2ProjMapping[devAddr][ind];
        }
        return res;
    }
}