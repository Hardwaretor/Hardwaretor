//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// This contract defines an ERC20 token with a capped supply and minting capability
contract HAW is ERC20 {
    uint256 public constant MAX_SUPPLY = 1000 * (10 ** 18); // Maximum supply of 1000 tokens
    uint256 public constant INITIAL_SUPPLY = 50 * (10 ** 18);

    address public owner;

    constructor() ERC20("Hardwaretor", "HAW") {
        owner = msg.sender;
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can mint tokens");
        _;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Minting would exceed max supply");
        _mint(to, amount);
    }
}
