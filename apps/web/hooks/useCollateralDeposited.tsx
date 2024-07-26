import { use, useEffect, useState } from "react";
import {
	useCollateralContract,
	useLendingContract,
	useStableContract,
} from "../lib/contracts";

import { useSDK } from "@metamask/sdk-react-ui";
import { type CollateralData, CollateralStatus } from "../types/collateral";

export const useCollateralDeposited = () => {
	const { account } = useSDK();
	const { isReady: lendingContractReady, contract: lendingContract } =
		useLendingContract();
	const { isReady: collateralContractReady, contract: collateralContract } =
		useCollateralContract();

	const [depositedNFTs, setDepositedNFTs] = useState<CollateralData[]>([]);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const loadNFTS = async () => {
			if (!lendingContractReady) return;
			if (!collateralContract) return;
			const nfts = await lendingContract.getDepositedNFTs(account);
			const loaded_nfts = await Promise.all(
				nfts.map(async (nftId) => {
					const value = await collateralContract?.getCollateralValue(nftId);
					return {
						tokenId: nftId.toString(16),
						value: value.toString(10),
						status: CollateralStatus.deposited,
					};
				}),
			);
			setDepositedNFTs(loaded_nfts);
		};

		if (lendingContractReady && collateralContractReady && account) {
			setLoading(true);
			loadNFTS()
				.then(() => {
					setError(null);
					setLoading(false);
				})
				.catch((error) => {
					console.error(error);
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
		depositedNFTs,
		loading,
		error,
		connected: lendingContractReady && collateralContractReady && !!account,
		withdraw: async (tokenId: string) => {
			if (!lendingContract) {
				throw new Error("Collateral contract not ready");
			}
			await lendingContract.withdrawNFT(BigInt(tokenId));
		},
	};
};
