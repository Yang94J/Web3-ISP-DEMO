// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
    Bottom layer of our platform
    Deal with user activities
 */
contract RegisterCenter is Ownable{

    using SafeMath for uint;

    enum State{UNREGISTERED, REGISTERED, SUBMIT, APPROVED, LOCKED}

    struct User {
        // unique UserInd
        uint userInd;
        // user address
        address investorAddress;
        // user description in profil
        string description;
        // if user has the authority to register project
        bool isDev;
        // state
        State state;
        // check if user has registered before
        uint registerTimestamp;
    }

    // for performance seek, the queue size should not exceed 10
    uint constant WAITING_LIST_SIZE = 10;

    event registerCenter_userRegister(address userAddress,bool isDev);
    event registerCenter_approveRegister(address userAddress,bool approved);
    event registerCenter_blockedByOwner(address userAddress,bool blocked);

    // user address to user struct
    mapping(address => User) public addr2UserMapping;

    // userInd to address mapping
    mapping(uint => address) public userInd2addrMapping;

    // waiting list for users
    address[] public userApplicationList;

    // waiting list for devs(should be user first)
    address[] public devApplicationList;

    // applied users
    uint public userNum = 0;

    // approved users
    uint public validUserNum = 0;

    // applied devs
    uint public devNum = 0;

    // approved devs
    uint public validDevNum = 0;

    // check if the list doesnt exceed max limit size and current address is not in list
    modifier waitingListApplicable(address target, address[] memory list) {
        require(list.length != WAITING_LIST_SIZE,"list full");
        for (uint i = 0; i < list.length; i++){
            require(target != list[i],"already in list");
        }
        _;
    }

    // check if the user has registered or not
    modifier userStateCheck(address userAddr,State state){
        require(addr2UserMapping[userAddr].state == state, "user state NotQualified");
        _;
    }

    // check if the user is dev or not (unblocked)
    modifier isUserDev(bool status){
        require(addr2UserMapping[msg.sender].state==State.APPROVED 
                && 
                addr2UserMapping[msg.sender].isDev==status,
                "dev status unqualified");
        _;
    }

    modifier indexCorrectCheck(uint ind, address addr, address[] memory list){
        require(list[ind]==addr,"address not valid");
        _;
    }

    // user register function
    function userRegister(string memory userDescription) external 
        userStateCheck(msg.sender,State.UNREGISTERED) 
        waitingListApplicable(msg.sender,userApplicationList) 
    {
        User storage user = addr2UserMapping[msg.sender];
        user.investorAddress = msg.sender;
        user.description = userDescription;
        user.isDev = false;
        user.registerTimestamp = block.timestamp;
        user.state = State.SUBMIT;

        userApplicationList.push(msg.sender);
        emit registerCenter_userRegister(msg.sender,false);
    }

    // approve user registration(no check needed)
    function approveUserRegister(uint index, address userAddress, bool approved) public 
        onlyOwner()
        indexCorrectCheck(index,userAddress,userApplicationList)
        {
        if (approved){
            addr2UserMapping[userAddress].state = State.APPROVED;
            addr2UserMapping[userAddress].userInd = userNum;
            userInd2addrMapping[userNum] = userAddress;

            userNum = userNum.add(1);
            validUserNum = validUserNum.add(1);
        }else{
            addr2UserMapping[userAddress].state = State.UNREGISTERED;               
        }
        userApplicationList[index] = userApplicationList[userApplicationList.length-1];
        userApplicationList.pop();
        emit registerCenter_approveRegister(userAddress,approved);
    }

    // register to be dev
    function devRegister() external 
        isUserDev(false)
        waitingListApplicable(msg.sender,devApplicationList)
    {
        devApplicationList.push(msg.sender);
        emit registerCenter_userRegister(msg.sender,true);
    }

    // approve devs register
    function approveDevRegister(uint index,address userAddress, bool approved) public 
    onlyOwner() 
    indexCorrectCheck(index,userAddress,devApplicationList)
    {
        if (approved){
            addr2UserMapping[userAddress].isDev = true;
            devNum = devNum.add(1);
            validDevNum = validDevNum.add(1);
        }

        devApplicationList[index] = devApplicationList[devApplicationList.length-1];
        devApplicationList.pop();

        emit registerCenter_approveRegister(userAddress,approved);
    }

    // for block and unblock
    function blockUser(address userAddress,bool blocked) public onlyOwner() {
        State state = addr2UserMapping[userAddress].state;
        if (state == State.APPROVED && blocked){
            validUserNum = validDevNum.sub(1);
            if (addr2UserMapping[userAddress].isDev){
                validDevNum = validDevNum.sub(1);
            }
            emit registerCenter_blockedByOwner(userAddress,blocked);
            return;
        }
        
        if (state == State.LOCKED && !blocked){
            validUserNum = validDevNum.add(1);
            if (addr2UserMapping[userAddress].isDev){
                validDevNum = validDevNum.add(1);
            }
            emit registerCenter_blockedByOwner(userAddress,blocked);
            return;
        }

        // not gonna happen
        revert();
    }

    // getUserApplicationList
    function getUserApplication() public view returns (address[] memory){
        address[] memory res = new address[](userApplicationList.length);
        for (uint ind = 0; ind < userApplicationList.length; ind++){
            res[ind] = userApplicationList[ind];
        }
        return res;
    }

    // getUserApplicationList
    function getDevApplication() public view returns (address[] memory){
        address[] memory res = new address[](devApplicationList.length);
        for (uint ind = 0; ind < devApplicationList.length; ind++){
            res[ind] = devApplicationList[ind];
        }
        return res;
    }

    function isUserCheck(address addr) public view returns(bool){
        return addr2UserMapping[addr].state==State.APPROVED;
    }

    function isDevCheck(address addr) public view returns(bool){
        return addr2UserMapping[addr].state==State.APPROVED
            &&
            addr2UserMapping[addr].isDev == true;
    }

}