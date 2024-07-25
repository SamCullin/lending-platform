// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/CollateralVault.sol";
import "../src/LendingBorrowing.sol";
import "../src/MockStable.sol";

contract DeployContracts is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy MockStableCoin
        MockStableCoin stableCoin = new MockStableCoin();

        // Deploy CollateralVault
        CollateralVault collateralVault = new CollateralVault("CollateralVault", "CVT");

        // Deploy LendingBorrowing
        LendingBorrowing lendingBorrowing = new LendingBorrowing(IERC20(address(stableCoin)), collateralVault);

        // Log addresses of deployed contracts
        console.log("MockStableCoin deployed at:", address(stableCoin));
        console.log("CollateralVault deployed at:", address(collateralVault));
        console.log("LendingBorrowing deployed at:", address(lendingBorrowing));

        vm.stopBroadcast();
    }
}
