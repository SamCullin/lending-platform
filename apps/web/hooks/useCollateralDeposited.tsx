import { use, useEffect, useState } from "react";
import {
	useCollateralContract,
	useLendingContract,
	useStableContract,
} from "./useContract";

import { useSDK } from "@metamask/sdk-react-ui";
import { ethers } from "ethers";
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

	const loadNFTS = async () => {
		if (!lendingContractReady) return;
		if (!collateralContract) return;
		console.log("Running Deposit Load");
		const nfts = await lendingContract.getDepositedNFTs(account);
		const loaded_nfts = await Promise.all(
			nfts.map(async (nftId) => {
				const value = await collateralContract?.getCollateralValue(nftId);
				const data = {
					tokenId: ethers.utils.hexValue(nftId),
					value: ethers.utils.formatUnits(value, 18),
					status: CollateralStatus.deposited,
				};
				console.log("Loaded Deposited NFT", JSON.stringify(data));
				return data;
			}),
		);
		setDepositedNFTs(loaded_nfts);
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
		reload: () => loadNFTS(),
		withdraw: async (tokenId: string) => {
			if (!lendingContract) {
				throw new Error("Collateral contract not ready");
			}
			await lendingContract.withdrawNFT(BigInt(tokenId));
		},
	};
};
