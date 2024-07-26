// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";


contract CollateralVault is ERC721, ERC721Enumerable, AccessControl, ERC721Burnable, IERC721Receiver  {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("BURNER_ROLE");

    

    mapping(uint256 => uint256) private _collateralValues;
    uint256 private _nextTokenId;

    event CollateralCreated(address indexed user, uint256 tokenId, uint256 value);

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _nextTokenId = 0; // Initialize the token ID tracker
    }


    function createCollateral(address to, uint256 value) external returns (uint256) {
        require(value > 0, "CollateralVault: value must be greater than 0");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _collateralValues[tokenId] = value;
        emit CollateralCreated(to, tokenId, value);
        return tokenId;
    }

    function burnCollateral(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "CollateralVault: caller is not the owner of the collateral");
        _burn(tokenId);
        delete _collateralValues[tokenId];
    }

     // Implement the IERC721Receiver interface
    function onERC721Received(address , address , uint256 , bytes calldata ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }


    function getCollateralValue(uint256 tokenId) external view returns (uint256) {
        return _collateralValues[tokenId];
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }



}
