// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract ShareNFT is ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenId;
    mapping(uint256 => uint) nftsharemapping;
    uint donationInd;


    constructor(string memory nftName, string memory symbol) ERC721(nftName,symbol) Ownable() {
        donationInd = 0;
    }

    function mint(address investorAddr, string memory tokenURI, uint share)
        public onlyOwner()
        returns (uint256)
    {
        uint256 newItemId = _tokenId.current();
        _mint(investorAddr, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _tokenId.increment();
        nftsharemapping[newItemId] = share;
        donationInd = newItemId;
        return newItemId;
    }

    function getTokenShare(uint256 tokenId) public view returns(uint){
        return nftsharemapping[tokenId];
    }

    function getDonationNum() public view returns(uint){
        return donationInd;
    }

}