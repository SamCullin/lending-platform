import { useEffect, useState } from "react";
import { useCollateralContract, useLendingContract } from "./useContract";

import { useSDK } from "@metamask/sdk-react-ui";
import { ethers } from "ethers";
import { RpcError } from "../lib/contracts";
import { type CollateralData, CollateralStatus } from "../types/collateral";

export const useCollateralOwned = () => {
	const { account } = useSDK();
	const { isReady: lendingContractReady, contract: lendingContract } =
		useLendingContract();
	const { isReady: collateralContractReady, contract: collateralContract } =
		useCollateralContract();

	const [ownedNFTs, setOwnedNfts] = useState<CollateralData[]>([]);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const loadNFTS = async () => {
		if (!lendingContractReady) return;
		if (!collateralContract) return;
		console.log("Running Owned Load");
		const nfts = await collateralContract.balanceOf(account);
		const loaded_nfts = await Promise.all(
			new Array(Number(nfts.toString())).fill(null).map(async (_, index) => {
				const tokenId = await collateralContract
					.tokenOfOwnerByIndex(account, index)
					.catch((err) => {
						throw new RpcError(
							"collateralContract.tokenOfOwnerByIndex",
							"Failed to load token by owner index",
							err,
						);
					});
				const [value, approved] = await Promise.all([
					collateralContract.getCollateralValue(tokenId).catch((err) => {
						throw new RpcError(
							"collateralContract.getCollateralValue",
							"Failed to load collateral value",
							err,
						);
					}),
					collateralContract.getApproved(tokenId).catch((err) => {
						throw new RpcError(
							"collateralContract.getApproved",
							"Failed to load approved status",
							err,
						);
					}),
				]);
				const data: CollateralData = {
					tokenId: ethers.utils.hexValue(tokenId),
					value: ethers.utils.formatUnits(value, 18),
					status:
						approved === lendingContract.address
							? CollateralStatus.approved
							: CollateralStatus.owned,
				};
				console.log("Loaded Owned NFT", JSON.stringify({ approved, data }));
				return data;
			}),
		);

		setOwnedNfts(loaded_nfts);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (lendingContractReady && collateralContractReady && account) {
			setLoading(true);
			loadNFTS()
				.then(() => {
					setError(null);
					setLoading(false);
				})
				.catch((error) => {
					if (error instanceof RpcError) {
						console.error(error.call);
					} else {
						console.error(error);
					}
					setError(error);
				});
		}
	}, [
		lendingContractReady,
		lendingContract,
		collateralContractReady,
		collateralContract,
		account,
	]);

	return {
		ownedNFTs,
		loading,
		error,
		connected: lendingContractReady && collateralContractReady && !!account,
		reload: () => loadNFTS(),
		deposit: async (tokenId: string) => {
			if (!lendingContract) {
				throw new Error("Collateral contract not ready");
			}
			await lendingContract.depositNFT(BigInt(tokenId));
		},
		approve: async (tokenId: string) => {
			if (!collateralContract || !lendingContract) {
				throw new Error("Collateral contract not ready");
			}
			await collateralContract.approve(
				lendingContract.address,
				BigInt(tokenId),
			);
		},
	};
};
