// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./CollateralVault.sol";

contract LendingBorrowing is IERC721Receiver  {
    using SafeERC20 for IERC20;
    IERC20 public stableCoin;
    CollateralVault public collateralVault;

    // Interest rate (annualized)
    uint256 public constant INTEREST_RATE = 5;
    uint256 public constant COLLATERALIZATION_RATIO = 80;

    // Mapping of borrowed & collateral amounts by users
    mapping(address => uint256) public _borrowedAmounts;
    mapping(address => uint256) public _collateralAmounts;

    // Mapping of deposited collateral by users
    mapping(address => uint256[]) public _depsitedCollateral;



    
    event BorrowedStable(address indexed user, uint256 amount);
    event RepaidStable(address indexed user, uint256 amount);
    event DepositCollateral(address indexed user, uint256 tokenId, uint256 value);
    event WithdrawCollateral(address indexed user, uint256 tokenId, uint256 value);


    constructor(IERC20 _stableCoin, CollateralVault _collateralVault) {
        stableCoin = _stableCoin;
        collateralVault = _collateralVault;
    }

    // Borrow stablecoins by collateralizing NFTs
    function borrow(uint256 amount) external {
        require(amount > 0, "Borrow amount must be greater than 0");

        uint256 reserveAmount = stableCoin.balanceOf(address(this));
        require(reserveAmount >= amount, "Not enough stablecoins in reserve");

        uint256 userCollateral = _collateralAmounts[msg.sender];
        uint256 userBorrowed = _borrowedAmounts[msg.sender];
        require(userCollateral - userBorrowed >= amount, "Cannot borrow more than collateral value");

        
        _borrowedAmounts[msg.sender] += amount;
        stableCoin.safeTransfer(msg.sender, amount);

        emit BorrowedStable(msg.sender, amount);
    }

    // Repay the borrowed stablecoins
    function repay(uint256 amount) external {
        require(amount > 0, "Repay amount must be greater than 0");

        uint256 userBorrowed = _borrowedAmounts[msg.sender];
        require(userBorrowed > 0, "No borrowed amount to repay");
        require(userBorrowed >= amount, "Repay amount exceeds borrowed amount");
        
        _borrowedAmounts[msg.sender] -= amount;
        stableCoin.safeTransferFrom(msg.sender, address(this), amount);

        emit RepaidStable(msg.sender, amount);
    }


    function depositNFT(uint256 tokenId) external {
        collateralVault.safeTransferFrom(msg.sender, address(this), tokenId);
        uint256 tokenValue = collateralVault.getCollateralValue(tokenId);
        _collateralAmounts[msg.sender] += tokenValue;
        _depsitedCollateral[msg.sender].push(tokenId);
        emit DepositCollateral(msg.sender, tokenId, tokenValue);
    }

    // Allow withdrawal of NFTs as long as the collateralization remains below 80%
    function withdrawNFT(uint256 tokenId) external {
        require(collateralVault.ownerOf(tokenId) == address(this), "Cannot withdraw, not owner of NFT");
        uint256 tokenValue = collateralVault.getCollateralValue(tokenId);
        require(_collateralAmounts[msg.sender] - tokenValue >= _borrowedAmounts[msg.sender], "Cannot withdraw, collateralization ratio exceeded");
        _collateralAmounts[msg.sender] -= tokenValue;
        _removeFromDepositedCollateral(msg.sender, tokenId);
        collateralVault.safeTransferFrom(address(this), msg.sender, tokenId);
        emit WithdrawCollateral(msg.sender, tokenId, tokenValue);
    }

    function getDepositedNFTs(address user) external view returns (uint256[] memory tokenIds) {
        return _depsitedCollateral[user];
    }

    function getBalance(address user) external view returns (uint256 borrowed, uint256 collateral) {
        return (_borrowedAmounts[user], _collateralAmounts[user]);
    }

    function _removeFromDepositedCollateral(address user, uint256 tokenId) internal {
        uint256[] storage tokenIds = _depsitedCollateral[user];
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenIds[i] == tokenId) {
                tokenIds[i] = tokenIds[tokenIds.length - 1];
                tokenIds.pop();
                break;
            }
        }
    }

    // Implement the IERC721Receiver interface
    function onERC721Received(address , address , uint256 , bytes calldata ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

}
