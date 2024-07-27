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
	const [error, setError] = useState<Error | unknown | null>(null);

	const loadNFTS = async () => {
		if (!lendingContractReady) return;
		if (!collateralContract) return;
		console.log("Running Owned Load");
		const nfts = await collateralContract.balanceOf(account);
		const loaded_nfts = await Promise.all(
			new Array(Number(nfts.toString())).fill(null).map(async (_, index) => {
				const tokenId = await collateralContract.tokenOfOwnerByIndex(
					account,
					index,
				);
				const [value, approved] = await Promise.all([
					collateralContract.getCollateralValue(tokenId),
					collateralContract.getApproved(tokenId),
				]);
				const data: CollateralData = {
					tokenId: tokenId,
					value: value,
					status:
						approved.toString().toLowerCase() ===
						lendingContract.address.toString().toLowerCase()
							? CollateralStatus.approved
							: CollateralStatus.owned,
				};
				return data;
			}),
		);

		setOwnedNfts(() => loaded_nfts);
	};

	const nftLoading = (tokenId: bigint) => {
		setOwnedNfts((prev) => {
			return prev.map((nft) => {
				if (nft.tokenId === tokenId) {
					return {
						...nft,
						status: CollateralStatus.loading,
					};
				}
				return nft;
			});
		});
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (lendingContractReady && collateralContractReady && account) {
			setLoading(true);
			loadNFTS()
				.then(() => {
					setError(null);
				})
				.catch((error) => {
					if (error instanceof RpcError) {
						console.error(error.call);
					} else {
						console.error(error);
					}
					setError(error);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [lendingContractReady, collateralContractReady, account]);

	return {
		ownedNFTs,
		loading,
		error,
		connected: lendingContractReady && collateralContractReady && !!account,
		reload: async () => {
			await new Promise((resolve) => setTimeout(resolve, 5000));
			await loadNFTS();
		},
		deposit: async (tokenId: bigint) => {
			if (!lendingContract) return;
			setError(null);
			nftLoading(tokenId);
			try {
				const res = await lendingContract.depositNFT(BigInt(tokenId));
				await res.wait();
			} catch (e) {
				setError(e);
			}
		},
		approve: async (tokenId: bigint) => {
			if (!collateralContract || !lendingContract) return;
			nftLoading(tokenId);
			setError(null);
			try {
				const res = await collateralContract.approve(
					lendingContract.address,
					BigInt(tokenId),
				);
				await res.wait();
			} catch (e) {
				setError(e);
			}
		},
	};
};
