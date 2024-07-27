import { useEffect, useState } from "react";
import { useLendingContract, useStableContract } from "./useContract";

import { useSDK } from "@metamask/sdk-react-ui";
import { ethers } from "ethers";
import { RpcError } from "../lib/contracts";

export const useCollateralStats = () => {
	const { account } = useSDK();

	const { isReady: lendingContractReady, contract: lendingContract } =
		useLendingContract();
	const { isReady: stableContractReady, contract: stableContract } =
		useStableContract();

	const [vaultData, setVaultData] = useState<{
		deposited: bigint | null;
		borrowed: bigint | null;
		available: bigint | null;
		allowance: bigint | null;
		vault: bigint | null;
		userBalance: bigint | null;
	}>({
		deposited: null,
		borrowed: null,
		available: null,
		allowance: null,
		vault: null,
		userBalance: null,
	});
	const [loading, setLoading] = useState(false);
	const [borrowLoading, setBorrowLoading] = useState(false);
	const [repayLoading, setRepayLoading] = useState(false);
	const [error, setError] = useState<Error | unknown | null>(null);

	const loadVaultStatus = async () => {
		if (!lendingContract) return;
		if (!stableContract) return;
		console.log("Running Vault Load");
		const [[borrowed, deposited], vault, allowance, userBalance] =
			await Promise.all([
				lendingContract.getBalance(account),
				stableContract.balanceOf(lendingContract.address),
				stableContract.allowance(account, lendingContract.address),
				stableContract.balanceOf(account),
			]);
		setVaultData(() => ({
			deposited: deposited,
			borrowed: borrowed,
			allowance: allowance,
			available: ethers.BigNumber.from(deposited)
				.sub(ethers.BigNumber.from(borrowed))
				.toBigInt(),
			vault: vault,
			userBalance: userBalance,
		}));
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (lendingContractReady && stableContractReady && account) {
			setLoading(true);
			loadVaultStatus()
				.then(() => {
					setError(null);
				})
				.catch((error) => {
					setError(error);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [lendingContractReady, stableContractReady, account]);

	return {
		vaultData,
		loading,
		borrowLoading,
		repayLoading,
		error,
		connected: lendingContractReady && stableContractReady && !!account,
		reload: () => loadVaultStatus(),
		approve: async (amount: number) => {
			if (!stableContract || !lendingContract) return;
			setRepayLoading(true);
			setError(null);
			try {
				const res = await stableContract.approve(
					lendingContract.address,
					ethers.utils.parseUnits(amount.toString(), 18).toBigInt(),
				);
				const tx = res.wait();
				return tx;
			} catch (e) {
				setError(e);
			} finally {
				setRepayLoading(false);
			}
		},
		borrow: async (amount: number) => {
			if (!lendingContract) return;
			setBorrowLoading(true);
			setError(null);
			try {
				const res = await lendingContract.borrow(
					ethers.utils.parseUnits(amount.toString(), 18).toBigInt(),
				);
				const tx = res.wait();
				return tx;
			} catch (e) {
				setError(e);
			} finally {
				setBorrowLoading(false);
			}
		},
		repay: async (amount: number) => {
			if (!lendingContract) return;
			setRepayLoading(true);
			setError(null);
			try {
				const res = await lendingContract.repay(
					ethers.utils.parseUnits(amount.toString(), 18).toBigInt(),
				);
				const tx = res.wait();
				return tx;
			} catch (e) {
				setError(e);
			} finally {
				setRepayLoading(false);
			}
		},
	};
};
