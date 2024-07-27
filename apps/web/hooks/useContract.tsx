import { useNetwork, useSDK } from "@metamask/sdk-react-ui";
import type { Abi } from "abitype";
import { ethers } from "ethers";
import { useEffect, useMemo } from "react";
import {
	collateralAbi,
	getContract,
	lendingAbi,
	mockStableAbi,
} from "../lib/contracts";

export const useContract = <T extends Abi>(
	address: string | undefined,
	abi: T,
) => {
	const ethereum = typeof window !== "undefined" ? window.ethereum : undefined;

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
	}, [address]);
};

export const useContractAddresses = () => {
	const network = useNetwork();
	const contractAddresses = {
		lending: (network.chain?.contracts?.lending as { address?: string })
			?.address,
		collateral: (network.chain?.contracts?.collateral as { address?: string })
			?.address,
		stable: (network.chain?.contracts?.stable as { address?: string })?.address,
	};
	return contractAddresses;
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
