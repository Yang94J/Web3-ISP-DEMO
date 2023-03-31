// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./InvestCenter.sol";

contract Platform is InvestCenter{

    string public platformName;

    constructor(string memory name) Ownable(){
        platformName = name;
    }


}