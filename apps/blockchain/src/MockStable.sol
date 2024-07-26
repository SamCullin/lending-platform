// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MockStableCoin is ERC20 {
    constructor() ERC20("MockStableCoin", "MSC") {
        _mint(msg.sender, 10000 ether); // Mint initial supply for testing
    }


    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}