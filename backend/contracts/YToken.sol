// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YToken is ERC20 {
    constructor(uint256 initialSupply, string memory tokenName, string memory tokenSig)
        ERC20(tokenName,tokenSig) 
    {
        _mint(msg.sender, initialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}