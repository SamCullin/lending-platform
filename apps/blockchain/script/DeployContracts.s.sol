// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/CollateralVault.sol";
import "../src/LendingBorrowing.sol";
import "../src/MockStable.sol";

contract DeployContracts is Script {


    function run() external {
        // Get the deployer and user private keys from environment variables
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        uint256 userPrivateKey = vm.envUint("USER_PRIVATE_KEY");

        address user = vm.addr(userPrivateKey);
        address deployer = vm.addr(deployerPrivateKey);

        console.log("User address: ", user);
        console.log("Deployer address: ", deployer);


        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy MockStableCoin
        MockStableCoin stableCoin = new MockStableCoin();

        // Deploy CollateralVault
        CollateralVault collateralVault = new CollateralVault("CollateralVault", "CVT");

        // Deploy LendingBorrowing
        LendingBorrowing lendingBorrowing = new LendingBorrowing(IERC20(address(stableCoin)), collateralVault);

        // Mint tokens to the lending contract and user
        stableCoin.mint(address(lendingBorrowing), 1000000 * 10**18);
        stableCoin.mint(user, 100 * 10**18);

        // Mint NFTs to the user
        uint256 tokenId_1 = collateralVault.createCollateral(user, 100 * 10 ** 18);
        uint256 tokenId_2 = collateralVault.createCollateral(user, 150 * 10 ** 18);
        uint256 tokenId_3 = collateralVault.createCollateral(user, 200 * 10 ** 18);
        uint256 tokenId_4 = collateralVault.createCollateral(user, 250 * 10 ** 18);
        uint256 tokenId_5 = collateralVault.createCollateral(user, 300 * 10 ** 18);
        uint256 tokenId_6 = collateralVault.createCollateral(user, 350 * 10 ** 18);

        // Log addresses of deployed contracts
        console.log("MockStableCoin deployed at:", address(stableCoin));
        console.log("CollateralVault deployed at:", address(collateralVault));
        console.log("LendingBorrowing deployed at:", address(lendingBorrowing));

        vm.stopBroadcast();

        // Start broadcasting transactions as user
        vm.startBroadcast(userPrivateKey);

        // Approve the lending contract to transfer user's NFTs
        collateralVault.approve(address(lendingBorrowing), tokenId_1);
        lendingBorrowing.depositNFT(tokenId_1);

        collateralVault.approve(address(lendingBorrowing), tokenId_2);
        lendingBorrowing.depositNFT(tokenId_2);

        // Take out a small loan from the lending contract
        lendingBorrowing.borrow(50 * 10**18);

        vm.stopBroadcast();
    }
}
