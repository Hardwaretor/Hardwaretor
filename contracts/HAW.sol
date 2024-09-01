// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HAW is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 300000000 * (10 ** 18); // Maximum supply of 1000 tokens
    uint256 public constant INITIAL_SUPPLY = 10000000 * (10 ** 18);

    struct Stake {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => Stake) public stakes;
    uint256 public stakingRewardRate = 10; // 10% reward rate

    constructor() ERC20("Hardwaretor", "HAW") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Minting would exceed max supply");
        _mint(to, amount);
    }

    function stakeTokens(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance to stake");
        _burn(msg.sender, amount);

        stakes[msg.sender] = Stake({
            amount: amount,
            timestamp: block.timestamp
        });
    }

    function unstakeTokens() external {
        require(stakes[msg.sender].amount > 0, "No tokens staked");

        uint256 stakedAmount = stakes[msg.sender].amount;
        uint256 stakedDuration = block.timestamp - stakes[msg.sender].timestamp;
        uint256 reward = (stakedAmount * stakingRewardRate * stakedDuration) / (365 days * 100);

        delete stakes[msg.sender];

        _mint(msg.sender, stakedAmount + reward);
    }

    function setStakingRewardRate(uint256 newRate) external onlyOwner {
        stakingRewardRate = newRate;
    }
}
