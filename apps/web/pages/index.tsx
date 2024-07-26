import type { NextPage } from "next";
import Head from "next/head";

import CollateralList from "../components/CollateralView";
import LendingForm from "../components/LendingForm";
import LendingSummary from "../components/LendingSummary";
import Navigation from "../components/Navigation";
import { useCollateralDeposited } from "../hooks/useCollateralDeposited";
import { useCollateralStats } from "../hooks/useCollateralStats";
import {
	CollateralAction,
	type CollateralData,
	CollateralStatus,
} from "../types/collateral";

const Mint: NextPage = () => {
	const { depositedNFTs, loading, error, withdraw } = useCollateralDeposited();

	const {
		vaultData,
		loading: statsLoading,
		error: statsError,
	} = useCollateralStats();

	const handle = (action: CollateralAction, tokenId: string) => {
		console.log(action, tokenId);
		if (action === CollateralAction.withdraw) {
			withdraw(tokenId);
		}
	};

	const owned: CollateralData[] = [
		{
			tokenId: "10",
			value: "10",
			status: CollateralStatus.approved,
		},
		{
			tokenId: "20",
			value: "20",
			status: CollateralStatus.owned,
		},
		{
			tokenId: "30",
			value: "30",
			status: CollateralStatus.owned,
		},
		{
			tokenId: "40",
			value: "40",
			status: CollateralStatus.owned,
		},
	];

	return (
		<div className="lending-platform">
			<Head>
				<title>Mock Lending Platform</title>
				<meta
					property="og:title"
					content="Mock lending platform using nft's as collateral"
					key="title"
				/>
			</Head>

			<Navigation />
			<CollateralList
				title="Wallet Collateral"
				collaterals={owned}
				handle={handle}
			/>
			<LendingSummary
				borrowed={vaultData.debt}
				deposited={vaultData.collateral}
				available={vaultData.vault}
				vaultAvailable={vaultData.vault}
			/>
			<LendingForm />
			<CollateralList
				title="Deposited Collateral"
				collaterals={depositedNFTs}
				handle={handle}
			/>
		</div>
	);
};

export default Mint;
