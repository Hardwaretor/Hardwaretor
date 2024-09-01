// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./NFT.sol";

contract NFTFactory {

    function createNFT(address to,string memory _tokenURI) external returns (address) {
        NFT newNFT = new NFT();
        emit NFTCreated(address(newNFT));
        return address(newNFT);
    }

     event NFTCreated(address newNFT);
}
