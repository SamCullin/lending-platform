import { useEffect, useState } from "react";
import { useLendingContract, useStableContract } from "./useContract";

import { useSDK } from "@metamask/sdk-react-ui";
import { ethers } from "ethers";

export const useCollateralStats = () => {
	const { account } = useSDK();

	const { isReady: lendingContractReady, contract: lendingContract } =
		useLendingContract();
	const { isReady: stableContractReady, contract: stableContract } =
		useStableContract();

	const [vaultData, setVaultData] = useState<{
		deposited: string;
		borrowed: string;
		available: string;
		vault: string;
	}>({
		deposited: "...",
		borrowed: "...",
		available: "...",
		vault: "...",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const loadVaultStatus = async () => {
		if (!lendingContract) return;
		if (!stableContract) return;
		console.log("Running Vault Load");
		const [[borrowed, deposited], vault] = await Promise.all([
			lendingContract.getBalance(account),
			stableContract.balanceOf(lendingContract.address),
		]);
		setVaultData({
			deposited: ethers.utils.formatUnits(deposited, 18),
			borrowed: ethers.utils.formatUnits(borrowed, 18),
			available: ethers.utils.formatUnits(
				ethers.BigNumber.from(deposited).sub(ethers.BigNumber.from(borrowed)),
				18,
			),
			vault: ethers.utils.formatUnits(vault, 18),
		});
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (lendingContractReady && stableContractReady && account) {
			setLoading(true);
			loadVaultStatus()
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
		stableContractReady,
		stableContract,
		account,
	]);

	return {
		vaultData,
		loading,
		error,
		connected: lendingContractReady && stableContractReady && !!account,
		reload: () => loadVaultStatus(),
	};
};
