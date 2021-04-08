// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//The underlying token is the base token you deposit to the liquidity address

contract UnderlyingToken is ERC20 {
    constructor() ERC20("UTK", "Underlying Token") {}

    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
