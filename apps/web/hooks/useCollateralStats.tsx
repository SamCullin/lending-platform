import { useEffect, useState } from "react";
import { useLendingContract, useStableContract } from "../lib/contracts";

import { useSDK } from "@metamask/sdk-react-ui";

export const useCollateralStats = () => {
	const { account } = useSDK();
	const { isReady: lendingContractReady, contract: lendingContract } =
		useLendingContract();
	const { isReady: stableContractReady, contract: stableContract } =
		useStableContract();

	const [vaultData, setVaultData] = useState<{
		collateral: string;
		debt: string;
		vault: string;
	}>({
		collateral: "...",
		debt: "...",
		vault: "...",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const loadVaultStatus = async () => {
			if (!lendingContract) return;
			if (!stableContract) return;
			const [[deposited, borrowed], vault] = await Promise.all([
				lendingContract.getBalance(account),
				stableContract.balanceOf(lendingContract.address),
			]);
			setVaultData({
				collateral: deposited.toString(10),
				debt: borrowed.toString(10),
				vault: vault.toString(10),
			});
		};

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
	};
};
