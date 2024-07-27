import { useEffect, useState } from "react";
import { useCollateralContract, useLendingContract } from "./useContract";

import { useSDK } from "@metamask/sdk-react-ui";
import { ethers } from "ethers";
import { RpcError } from "../lib/contracts";
import { type CollateralData, CollateralStatus } from "../types/collateral";

export const useCollateralDeposited = () => {
	const { account } = useSDK();
	const { isReady: lendingContractReady, contract: lendingContract } =
		useLendingContract();
	const { isReady: collateralContractReady, contract: collateralContract } =
		useCollateralContract();

	const [depositedNFTs, setDepositedNFTs] = useState<CollateralData[]>([]);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | unknown | null>(null);

	const nftLoading = (tokenId: bigint) => {
		setDepositedNFTs((nfts) => {
			return nfts.map((nft) => {
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

	const loadNFTS = async () => {
		if (!lendingContractReady) return;
		if (!collateralContract) return;
		console.log("Running Deposit Load");
		const [nfts, [borrowed, deposited]] = await Promise.all([
			lendingContract.getDepositedNFTs(account).catch((err) => {
				throw new RpcError(
					"lendingContract.getDepositedNFTs",
					"Failed to load deposited NFTs",
					err,
				);
			}),
			lendingContract.getBalance(account).catch((err) => {
				throw new RpcError(
					"lendingContract.getBalance",
					"Failed to load balance",
					err,
				);
			}),
		]);

		const available = ethers.BigNumber.from(deposited).sub(
			ethers.BigNumber.from(borrowed),
		);

		const loaded_nfts = await Promise.all(
			nfts.map(async (nftId) => {
				const value = await collateralContract
					?.getCollateralValue(nftId)
					.catch((err) => {
						throw new RpcError(
							"collateralContract.getCollateralValue",
							"Failed to load collateral value",
							err,
						);
					});
				const data = {
					tokenId: nftId,
					value: value,
					status: available.sub(ethers.BigNumber.from(value)).lt(0)
						? CollateralStatus.locked
						: CollateralStatus.deposited,
				};
				return data;
			}),
		);
		setDepositedNFTs(() => loaded_nfts);
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
	}, [lendingContractReady, collateralContractReady, account]);

	return {
		depositedNFTs,
		loading,
		error,
		connected: lendingContractReady && collateralContractReady && !!account,
		reload: () => loadNFTS(),
		withdraw: async (tokenId: bigint) => {
			if (!lendingContract) {
				throw new Error("Collateral contract not ready");
			}
			setError(null);
			nftLoading(tokenId);
			try {
				const res = await lendingContract.withdrawNFT(BigInt(tokenId));
				await res.wait();
			} catch (e) {
				setError(e);
			}
		},
	};
};
