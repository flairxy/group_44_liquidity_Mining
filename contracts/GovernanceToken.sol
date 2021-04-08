// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GovernanceToken is ERC20, Ownable {
    //Only the owner of the contract can mint new governance token and the owner here is the liquidity pool
    constructor() ERC20("GTK", "Governance Token") Ownable() {}

    function mint(address to, uint256 amount) external onlyOwner() {
        _mint(to, amount);
    }
}
