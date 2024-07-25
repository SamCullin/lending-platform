// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/LendingBorrowing.sol";
import "../src/CollateralVault.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockStableCoin is ERC20 {
    constructor() ERC20("MockStableCoin", "MSC") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract LendingBorrowingTest is Test {
    LendingBorrowing public lendingBorrowing;
    CollateralVault public vault;
    MockStableCoin public stableCoin;

    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        vault = new CollateralVault("CollateralVault", "CVT");
        stableCoin = new MockStableCoin();
        lendingBorrowing = new LendingBorrowing(IERC20(address(stableCoin)), vault);

        stableCoin.mint(address(lendingBorrowing), 10000 ether);
    }

    function testDepositNFT() public {
        uint256 value = 100;
        uint256 tokenId = vault.createCollateral(user1, value);

        vm.startPrank(user1);
        vault.approve(address(lendingBorrowing), tokenId);
        lendingBorrowing.depositNFT(tokenId);
        (uint256 borrowed, uint256 collateral) = lendingBorrowing.getBalance(user1);
        vm.stopPrank();

        assertEq(collateral, value, "Collateral value should be equal to the value of the NFT");
        assertEq(borrowed, 0, "Borrowed amount should be 0");
    }

    function testBorrowAndRepay() public {
        uint256 value = 100;
        uint256 tokenId = vault.createCollateral(address(this), value);

        vm.startPrank(user1);
        vault.approve(address(lendingBorrowing), tokenId);
        lendingBorrowing.depositNFT(tokenId);

        uint256 borrowAmount = 50;
        lendingBorrowing.borrow(borrowAmount);
        assertEq(stableCoin.balanceOf(user1), borrowAmount, "Stablecoin balance should be equal to the borrowed amount");

        (uint256 borrowed, uint256 collateral) = lendingBorrowing.getBalance(user1);
        assertEq(borrowed, borrowAmount, "Borrowed amount should be equal to the borrowed amount");
        assertEq(collateral, value, "Collateral value should be equal to the value of the NFT");

        lendingBorrowing.repay(borrowAmount);
        assertEq(stableCoin.balanceOf(address(this)), 0, "Stablecoin balance should be 0");

        (borrowed, collateral) = lendingBorrowing.getBalance(user1);
        assertEq(borrowed, 0, "Borrowed amount should be 0");
        assertEq(collateral, value, "Collateral value should be equal to the value of the NFT");

        vm.stopPrank();
    }

    function testWithdrawNFT() public {
        uint256 value = 100;
        uint256 tokenId = vault.createCollateral(user1, value);

        vm.startPrank(user1);
        vault.approve(address(lendingBorrowing), tokenId);
        lendingBorrowing.depositNFT(tokenId);

        uint256 borrowAmount = 50;
        lendingBorrowing.borrow(borrowAmount);
        lendingBorrowing.repay(borrowAmount);
        lendingBorrowing.withdrawNFT(tokenId);

        (uint256 borrowed, uint256 collateral) = lendingBorrowing.getBalance(user1);
        assertEq(collateral, 0, "Collateral value should be 0");
        assertEq(borrowed, 0, "Borrowed amount should be 0");
    }
}
