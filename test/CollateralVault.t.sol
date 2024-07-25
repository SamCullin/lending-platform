// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/CollateralVault.sol";

contract CollateralVaultTest is Test {
    CollateralVault public vault;

    address public user1  = address(0x1);
    address public user2  = address(0x2);

    function setUp() public {
        vault = new CollateralVault("CollateralVault", "CVT");
    }

    function testCreateCollateral() public {
        uint256 value = 100;
        uint256 tokenId = vault.createCollateral(user1, value);
        assertEq(vault.getCollateralValue(tokenId), value);
        assertEq(vault.ownerOf(tokenId), user1);
    }

    function testBurnCollateral() public {
        uint256 value = 100;
        uint256 tokenId = vault.createCollateral(user1, value);
        vm.prank(user1);
        vault.burnCollateral(tokenId);
        assertEq(vault.getCollateralValue(tokenId), 0);
    }

    function testTransfer() public {
        uint256 value = 100;
        uint256 tokenId = vault.createCollateral(user1, value);
        vm.prank(user1);
        vault.approve(address(this), tokenId);
        vault.transferFrom(user1, user2, tokenId);
        assertEq(vault.ownerOf(tokenId), user2);
    }

    
}
