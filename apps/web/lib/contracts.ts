import type { SDKProvider } from "@metamask/sdk";
import { useNetwork, useSDK } from "@metamask/sdk-react-ui";
import type { Abi } from "abitype";
import { erc20Abi } from "abitype/abis";
import { Contract, type ContractInterface, ethers } from "ethers";
import type { TypedContract } from "ethers-abitype";
import { useMemo } from "react";

export const lendingAbi = [
	{
		type: "constructor",
		inputs: [
			{
				name: "_stableCoin",
				type: "address",
				internalType: "contract IERC20",
			},
			{
				name: "_collateralVault",
				type: "address",
				internalType: "contract CollateralVault",
			},
		],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "COLLATERALIZATION_RATIO",
		inputs: [],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "INTEREST_RATE",
		inputs: [],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "_borrowedAmounts",
		inputs: [{ name: "", type: "address", internalType: "address" }],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "_collateralAmounts",
		inputs: [{ name: "", type: "address", internalType: "address" }],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "_depsitedCollateral",
		inputs: [
			{ name: "", type: "address", internalType: "address" },
			{ name: "", type: "uint256", internalType: "uint256" },
		],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "borrow",
		inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "collateralVault",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "contract CollateralVault",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "depositNFT",
		inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "getBalance",
		inputs: [{ name: "user", type: "address", internalType: "address" }],
		outputs: [
			{ name: "borrowed", type: "uint256", internalType: "uint256" },
			{ name: "collateral", type: "uint256", internalType: "uint256" },
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getDepositedNFTs",
		inputs: [{ name: "user", type: "address", internalType: "address" }],
		outputs: [
			{ name: "tokenIds", type: "uint256[]", internalType: "uint256[]" },
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "onERC721Received",
		inputs: [
			{ name: "", type: "address", internalType: "address" },
			{ name: "", type: "address", internalType: "address" },
			{ name: "", type: "uint256", internalType: "uint256" },
			{ name: "", type: "bytes", internalType: "bytes" },
		],
		outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
		stateMutability: "pure",
	},
	{
		type: "function",
		name: "repay",
		inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "stableCoin",
		inputs: [],
		outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "withdrawNFT",
		inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "event",
		name: "BorrowedStable",
		inputs: [
			{
				name: "user",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "amount",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "DepositCollateral",
		inputs: [
			{
				name: "user",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "tokenId",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "value",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "RepaidStable",
		inputs: [
			{
				name: "user",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "amount",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "WithdrawCollateral",
		inputs: [
			{
				name: "user",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "tokenId",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "value",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{
		type: "error",
		name: "SafeERC20FailedOperation",
		inputs: [{ name: "token", type: "address", internalType: "address" }],
	},
] as const;

export const collateralAbi = [
	{
		type: "constructor",
		inputs: [
			{ name: "name", type: "string", internalType: "string" },
			{ name: "symbol", type: "string", internalType: "string" },
		],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "ADMIN_ROLE",
		inputs: [],
		outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "DEFAULT_ADMIN_ROLE",
		inputs: [],
		outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "MINTER_ROLE",
		inputs: [],
		outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "approve",
		inputs: [
			{ name: "to", type: "address", internalType: "address" },
			{ name: "tokenId", type: "uint256", internalType: "uint256" },
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "balanceOf",
		inputs: [{ name: "owner", type: "address", internalType: "address" }],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "burn",
		inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "burnCollateral",
		inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "createCollateral",
		inputs: [
			{ name: "to", type: "address", internalType: "address" },
			{ name: "value", type: "uint256", internalType: "uint256" },
		],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "getApproved",
		inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
		outputs: [{ name: "", type: "address", internalType: "address" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getCollateralValue",
		inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getRoleAdmin",
		inputs: [{ name: "role", type: "bytes32", internalType: "bytes32" }],
		outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "grantRole",
		inputs: [
			{ name: "role", type: "bytes32", internalType: "bytes32" },
			{ name: "account", type: "address", internalType: "address" },
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "hasRole",
		inputs: [
			{ name: "role", type: "bytes32", internalType: "bytes32" },
			{ name: "account", type: "address", internalType: "address" },
		],
		outputs: [{ name: "", type: "bool", internalType: "bool" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "isApprovedForAll",
		inputs: [
			{ name: "owner", type: "address", internalType: "address" },
			{ name: "operator", type: "address", internalType: "address" },
		],
		outputs: [{ name: "", type: "bool", internalType: "bool" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "name",
		inputs: [],
		outputs: [{ name: "", type: "string", internalType: "string" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "onERC721Received",
		inputs: [
			{ name: "", type: "address", internalType: "address" },
			{ name: "", type: "address", internalType: "address" },
			{ name: "", type: "uint256", internalType: "uint256" },
			{ name: "", type: "bytes", internalType: "bytes" },
		],
		outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
		stateMutability: "pure",
	},
	{
		type: "function",
		name: "ownerOf",
		inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
		outputs: [{ name: "", type: "address", internalType: "address" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "renounceRole",
		inputs: [
			{ name: "role", type: "bytes32", internalType: "bytes32" },
			{
				name: "callerConfirmation",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "revokeRole",
		inputs: [
			{ name: "role", type: "bytes32", internalType: "bytes32" },
			{ name: "account", type: "address", internalType: "address" },
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "safeTransferFrom",
		inputs: [
			{ name: "from", type: "address", internalType: "address" },
			{ name: "to", type: "address", internalType: "address" },
			{ name: "tokenId", type: "uint256", internalType: "uint256" },
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "safeTransferFrom",
		inputs: [
			{ name: "from", type: "address", internalType: "address" },
			{ name: "to", type: "address", internalType: "address" },
			{ name: "tokenId", type: "uint256", internalType: "uint256" },
			{ name: "data", type: "bytes", internalType: "bytes" },
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "setApprovalForAll",
		inputs: [
			{ name: "operator", type: "address", internalType: "address" },
			{ name: "approved", type: "bool", internalType: "bool" },
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "supportsInterface",
		inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
		outputs: [{ name: "", type: "bool", internalType: "bool" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "symbol",
		inputs: [],
		outputs: [{ name: "", type: "string", internalType: "string" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "tokenByIndex",
		inputs: [{ name: "index", type: "uint256", internalType: "uint256" }],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "tokenOfOwnerByIndex",
		inputs: [
			{ name: "owner", type: "address", internalType: "address" },
			{ name: "index", type: "uint256", internalType: "uint256" },
		],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "tokenURI",
		inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
		outputs: [{ name: "", type: "string", internalType: "string" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "totalSupply",
		inputs: [],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "transferFrom",
		inputs: [
			{ name: "from", type: "address", internalType: "address" },
			{ name: "to", type: "address", internalType: "address" },
			{ name: "tokenId", type: "uint256", internalType: "uint256" },
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "event",
		name: "Approval",
		inputs: [
			{
				name: "owner",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "approved",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "ApprovalForAll",
		inputs: [
			{
				name: "owner",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "operator",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "approved",
				type: "bool",
				indexed: false,
				internalType: "bool",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "CollateralCreated",
		inputs: [
			{
				name: "user",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "tokenId",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "value",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "RoleAdminChanged",
		inputs: [
			{
				name: "role",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32",
			},
			{
				name: "previousAdminRole",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32",
			},
			{
				name: "newAdminRole",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "RoleGranted",
		inputs: [
			{
				name: "role",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32",
			},
			{
				name: "account",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "sender",
				type: "address",
				indexed: true,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "RoleRevoked",
		inputs: [
			{
				name: "role",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32",
			},
			{
				name: "account",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "sender",
				type: "address",
				indexed: true,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "Transfer",
		inputs: [
			{
				name: "from",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "to",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{ type: "error", name: "AccessControlBadConfirmation", inputs: [] },
	{
		type: "error",
		name: "AccessControlUnauthorizedAccount",
		inputs: [
			{ name: "account", type: "address", internalType: "address" },
			{ name: "neededRole", type: "bytes32", internalType: "bytes32" },
		],
	},
	{
		type: "error",
		name: "ERC721EnumerableForbiddenBatchMint",
		inputs: [],
	},
	{
		type: "error",
		name: "ERC721IncorrectOwner",
		inputs: [
			{ name: "sender", type: "address", internalType: "address" },
			{ name: "tokenId", type: "uint256", internalType: "uint256" },
			{ name: "owner", type: "address", internalType: "address" },
		],
	},
	{
		type: "error",
		name: "ERC721InsufficientApproval",
		inputs: [
			{ name: "operator", type: "address", internalType: "address" },
			{ name: "tokenId", type: "uint256", internalType: "uint256" },
		],
	},
	{
		type: "error",
		name: "ERC721InvalidApprover",
		inputs: [{ name: "approver", type: "address", internalType: "address" }],
	},
	{
		type: "error",
		name: "ERC721InvalidOperator",
		inputs: [{ name: "operator", type: "address", internalType: "address" }],
	},
	{
		type: "error",
		name: "ERC721InvalidOwner",
		inputs: [{ name: "owner", type: "address", internalType: "address" }],
	},
	{
		type: "error",
		name: "ERC721InvalidReceiver",
		inputs: [{ name: "receiver", type: "address", internalType: "address" }],
	},
	{
		type: "error",
		name: "ERC721InvalidSender",
		inputs: [{ name: "sender", type: "address", internalType: "address" }],
	},
	{
		type: "error",
		name: "ERC721NonexistentToken",
		inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
	},
	{
		type: "error",
		name: "ERC721OutOfBoundsIndex",
		inputs: [
			{ name: "owner", type: "address", internalType: "address" },
			{ name: "index", type: "uint256", internalType: "uint256" },
		],
	},
] as const;

export const mockStableAbi = erc20Abi;

export const getContract = <T extends Abi>(
	address: string,
	signer: ethers.providers.Provider | ethers.Signer,
	abi: T,
) => {
	console.log("Creating Contract", address);
	return new Contract(
		address,
		abi as ContractInterface,
		signer,
	) as unknown as TypedContract<T>;
};

export const useContract = <T extends Abi>(
	address: string | undefined,
	abi: T,
) => {
	const ethereum = typeof window !== "undefined" ? window.ethereum : undefined;
	return useMemo(() => {
		if (!address || !ethereum) {
			return {
				isReady: false,
				contract: null,
			} as const;
		}
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const provider = new ethers.providers.Web3Provider(ethereum as any);
		const signer = provider.getSigner();
		return {
			isReady: true,
			contract: getContract(address, signer, abi),
		} as const;
	}, [address, ethereum, abi]);
};

export const useContractAddresses = () => {
	const network = useNetwork();
	return {
		lending: (network.chain?.contracts?.lending as { address: string })
			?.address,
		collateral: (network.chain?.contracts?.collateral as { address: string })
			?.address,
		stable: (network.chain?.contracts?.stable as { address: string })?.address,
	};
};

export const useLendingContract = () => {
	const { lending } = useContractAddresses();
	return useContract(lending, lendingAbi);
};

export const useCollateralContract = () => {
	const { collateral } = useContractAddresses();
	return useContract(collateral, collateralAbi);
};

export const useStableContract = () => {
	const { stable } = useContractAddresses();
	return useContract(stable, mockStableAbi);
};
