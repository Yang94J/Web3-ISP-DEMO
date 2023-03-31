// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ProjCenter.sol";
// import "./IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
    InvestCenter layer mainly deal with invest issues
 */
contract InvestCenter is ProjCenter {

    using SafeMath for uint;


    // donation record
    struct Donation {

        // donation Id
        uint donationId;

        // project address
        address projAddr;

        // donation user address
        address donationUser;

        // donation amount
        uint donationAmount;

        // donation timestamp
        uint donateTimestamp;

        // total reflection got
        uint reflection;

        // nft tokenId (not necessarily owned by the user)
        uint tokenId;
    }

    event investorCenter_donation(address userAddr, address projAddr, address nftAddr, uint tokenId);
    event investorCenter_reflect(address projAddr, uint amount);

    mapping(uint => Donation) public donations;
    mapping(address => mapping(uint => uint)) public user2DonationInd;
    mapping(address => mapping(uint => uint)) public proj2DonationInd;
    mapping(address => uint) public user2DonationTimes;
    mapping(address => uint) public proj2DonationTimes;

    uint public donationId;

    // donation check   
    modifier donationAvailableCheck(address projAddr, uint amount){
        require(amount>0,"donation non-0");
        require(projAddr2ProjFundingMapping[projAddr].donationAmount + amount <= projAddr2ProjFundingMapping[projAddr].requireAmount,"no donation space");
        require(block.timestamp < projAddr2ProjFundingMapping[projAddr].initTimestamp + projAddr2ProjFundingMapping[projAddr].duration, "time expire");
        _;
    }

    modifier reflectProjAddrCheck(address projAddr){
        require(projAddr2ProjMapping[projAddr].projAddr == msg.sender,"should be triggered by projAddr");
        _;
    }

    constructor() ProjCenter() {
        
    }

    // user can donate to a certain project
    function donate(address projAddr,uint amount, string memory tokenUrl) external payable 
        userStateCheck(msg.sender,State.APPROVED) 
        projStateValid(projAddr,State.APPROVED) 
        donationAvailableCheck(projAddr,amount) 
        returns(bool)
    {
        bool requireEth = projAddr2ProjFundingMapping[projAddr].requireEth;
        if (requireEth){
            require(msg.value == amount,"amount error");
            payable(projAddr).transfer(msg.value);
        }else{
            address tokenAddress = projAddr2ProjFundingMapping[projAddr].erc20Address;
            transferFromERC20(tokenAddress,msg.sender,amount);
            transferERC20(tokenAddress,projAddr,amount);
        }

        postDonate(projAddr,amount,tokenUrl);
        return true;
    }

    // state change after donation
    function postDonate(address projAddr, uint amount,string memory tokenUrl) internal{

        Donation storage donation = donations[donationId];
        donation.donationId = donationId;
        donation.projAddr = projAddr;
        donation.donationUser = msg.sender;
        donation.donationAmount = amount;
        donation.donateTimestamp = block.timestamp;
        donation.tokenId = ShareNFT(projAddr2ProjFundingMapping[projAddr].nftAddress).mint(msg.sender, tokenUrl, amount);

        projAddr2ProjFundingMapping[projAddr].donationAmount =  
            projAddr2ProjFundingMapping[projAddr].donationAmount.add(amount);
        proj2DonationInd[projAddr][proj2DonationTimes[projAddr]] = donationId;
        user2DonationInd[msg.sender][user2DonationTimes[msg.sender]] = donationId;

        donationId = donationId.add(1);
        user2DonationTimes[msg.sender] = user2DonationTimes[msg.sender].add(1);
        proj2DonationTimes[projAddr] = proj2DonationTimes[projAddr].add(1);

        emit investorCenter_donation(msg.sender,projAddr,projAddr2ProjFundingMapping[projAddr].nftAddress,donation.tokenId);
    }

    // reflection triggered by proj donation address
    function reflection(address projAddr,uint amount) public payable 
        reflectProjAddrCheck(projAddr)
        returns (bool){
        bool requireEth = projAddr2ProjFundingMapping[projAddr].requireEth;
        postReflection(requireEth,projAddr,amount);
        return true;
        
    }

    // perform reflection transactions
    function postReflection(bool requireEth, address projAddr, uint amount) internal {

        if (requireEth) {
            reflectETH(projAddr,amount);
        }else{
            reflectERC20(projAddr,amount);
        }
        projAddr2ProjFundingMapping[projAddr].reflectionAmount =  projAddr2ProjFundingMapping[projAddr].reflectionAmount.add(amount);
        emit investorCenter_reflect(projAddr,amount);
    }

    // distribute eth
    function reflectETH(address projAddr, uint amount) internal {
        require(msg.value == amount,"amount error");
        address nftAddr = projAddr2ProjFundingMapping[projAddr].nftAddress;
        uint tokenIdMax = proj2DonationTimes[projAddr];
        uint totalShare = projAddr2ProjFundingMapping[projAddr].donationAmount;
        for (uint ind = 0; ind < tokenIdMax; ind++){
            address owner = ShareNFT(nftAddr).ownerOf(ind);
            uint share = donations[proj2DonationInd[projAddr][ind]].donationAmount;
            payable(owner).transfer(amount.mul(share).div(totalShare));
            donations[proj2DonationInd[projAddr][ind]].reflection = donations[proj2DonationInd[projAddr][ind]].reflection.add((amount * share / totalShare));
        }
    }

    // distibute erc20
    function reflectERC20(address projAddr, uint amount) internal {
        address tokenAddress = projAddr2ProjFundingMapping[projAddr].erc20Address;
        transferFromERC20(tokenAddress,projAddr,amount);
        address nftAddr = projAddr2ProjFundingMapping[projAddr].nftAddress;
        uint tokenIdMax = proj2DonationTimes[projAddr];
        uint totalShare = projAddr2ProjFundingMapping[projAddr].donationAmount;
        for (uint ind = 0; ind < tokenIdMax; ind++){
            address owner = ShareNFT(nftAddr).ownerOf(ind);
            uint share = donations[proj2DonationInd[projAddr][ind]].donationAmount;
            transferERC20(tokenAddress,owner,amount.mul(share).div(totalShare));
            donations[proj2DonationInd[projAddr][ind]].reflection = donations[proj2DonationInd[projAddr][ind]].reflection.add((amount * share / totalShare));
        }
    }

    // transfer ERC20 from 
    function transferFromERC20(address tokenAddress,address from, uint amount) internal {
        IERC20(tokenAddress).transferFrom(from, address(this), amount);
    }

    // transfer ERC20
    function transferERC20(address tokenAddress, address to, uint amount) internal {
        IERC20(tokenAddress).transfer(to,amount);
    }
}