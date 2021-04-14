// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./UnderlyingToken.sol";
import "./LpToken.sol";
import "./GovernanceToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract LiquidityPool is LpToken {
    using SafeMath for uint256;

    mapping(address => uint256) public checkpoints; //this will be used to calculate the governance token
    address[] public users;
    uint256 public totalPool;

    // create pointers
    UnderlyingToken public underlyingToken;
    GovernanceToken public governanceToken;
    uint256 public constant REWARD_PER_BLOCK = 1;

    constructor(address _underlyingToken, address _governanceToken) {
        // instantiate our pointers. This will help us communicate with teh contracts
        underlyingToken = UnderlyingToken(_underlyingToken);
        governanceToken = GovernanceToken(_governanceToken);
    }

    //returns the checkpoints
    function getUsers() external view returns (address[] memory) {
        return users;
    }

    //returns the underlying token balance of user
    function underTokenBalance() external view returns (uint256) {
        return underlyingToken.balanceOf(msg.sender);
    }

    function govTokenBalance() external view returns (uint256) {
        return governanceToken.balanceOf(msg.sender);
    }

    function deposit(uint256 amount) external {
        // checkpoints are used as a reference to distribute the governance token reward.
        // Example, if an investor invests at block 10 and withdraws t block 50 then he'll be given a token equivalent to 5 blocks
        require(amount > 0, "amount must be greater than 0");
        if (checkpoints[msg.sender] == 0) {
            checkpoints[msg.sender] = block.number;
            users.push(msg.sender);
        }
        _distributeReward(msg.sender);
        underlyingToken.transferFrom(msg.sender, address(this), amount);
        totalPool = totalPool.add(amount);
        // mint some LpToken for the investor
        _mint(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        // here the amount is for user LpToken
        require(balanceOf(msg.sender) >= amount, "not enough LP token");
        _distributeReward(msg.sender);
        underlyingToken.transfer(msg.sender, amount);
        totalPool = totalPool.sub(amount);
        _burn(msg.sender, amount);
    }

    //we base our distribution amount on the balance of LpToken
    //Note: In this project the exchange rate between the LpToken and the underlying token is always 1, but in a real DeFi protocol it is much more complex than that (You may have to multiply the LpToken balance by the exchange rate to get the balance in underlying token)
    function _distributeReward(address beneficiary) internal {
        // get the checkpoint of the beneficiary
        uint256 checkpoint = checkpoints[beneficiary];
        if (block.number - checkpoint > 0) {
            uint256 distributionAmount =
                balanceOf(beneficiary) *
                    (block.number - checkpoint * REWARD_PER_BLOCK);
            governanceToken.mint(beneficiary, distributionAmount);

            // update the checkpoint
            checkpoints[beneficiary] = block.number;
        }
    }
}
