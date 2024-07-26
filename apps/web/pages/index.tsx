import type { NextPage } from "next";
import Head from "next/head";

import CollateralList from "../components/CollateralView";
import LendingForm from "../components/LendingForm";
import LendingSummary from "../components/LendingSummary";
import Navigation from "../components/Navigation";
import { useCollateralDeposited } from "../hooks/useCollateralDeposited";
import { useCollateralOwned } from "../hooks/useCollateralOwned";
import { useCollateralStats } from "../hooks/useCollateralStats";
import { useReset } from "../hooks/useReset";
import {
	CollateralAction,
	type CollateralData,
	CollateralStatus,
} from "../types/collateral";

const Mint: NextPage = () => {
	const {
		depositedNFTs,
		loading,
		error,
		withdraw,
		reload: reloadDeposited,
	} = useCollateralDeposited();
	const {
		ownedNFTs,
		approve,
		deposit,
		reload: reloadOwned,
	} = useCollateralOwned();

	const {
		vaultData,
		loading: statsLoading,
		error: statsError,
		reload: reloadStats,
	} = useCollateralStats();

	const reload = async () => {
		await reloadDeposited();
		await reloadOwned();
		await reloadStats();
	};

	const handle = async (action: CollateralAction, tokenId: string) => {
		console.log(CollateralAction[action], tokenId);
		switch (action) {
			case CollateralAction.approve:
				await approve(tokenId)
					.then(() =>
						console.log("Finished", CollateralAction[action], tokenId),
					)
					.then(() => reloadOwned())
					.then(() => console.log("Reloaded"));

				break;
			case CollateralAction.deposit:
				await deposit(tokenId)
					.then(() =>
						console.log("Finished", CollateralAction[action], tokenId),
					)
					.then(() => reload())
					.then(() => console.log("Reloaded"));
				break;
			case CollateralAction.withdraw:
				await withdraw(tokenId)
					.then(() =>
						console.log("Finished", CollateralAction[action], tokenId),
					)
					.then(() => reload())
					.then(() => console.log("Reloaded"));
				break;
			default:
				break;
		}
	};

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
				collaterals={ownedNFTs}
				handle={handle}
			/>
			<LendingSummary
				borrowed={vaultData.borrowed}
				deposited={vaultData.deposited}
				available={vaultData.available}
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
