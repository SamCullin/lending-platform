import type { NextPage } from "next";
import Head from "next/head";

import { useEffect } from "react";
import CollateralList from "../components/CollateralView";
import LendingForm from "../components/LendingForm";
import LendingSummary from "../components/LendingSummary";
import Navigation from "../components/Navigation";
import { useCollateralDeposited } from "../hooks/useCollateralDeposited";
import { useCollateralOwned } from "../hooks/useCollateralOwned";
import { useCollateralStats } from "../hooks/useCollateralStats";
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
		approve: approveNft,
		deposit,
		reload: reloadOwned,
	} = useCollateralOwned();

	const {
		vaultData,
		loading: statsLoading,
		repayLoading,
		borrowLoading,
		error: statsError,
		reload: reloadStats,
		approve: approveDeposit,
		borrow,
		repay,
	} = useCollateralStats();

	const reload = async () => {
		await reloadDeposited();
		await reloadOwned();
		await reloadStats();
	};

	const handle = async (action: CollateralAction, tokenId: bigint) => {
		console.log(CollateralAction[action], tokenId);
		switch (action) {
			case CollateralAction.approve:
				await approveNft(tokenId)
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

	const borrowAmount = async (amount: number) => {
		await borrow(amount).then(() => {
			console.log("Finished borrowing", amount);
			return Promise.all([reloadStats(), reloadDeposited()]);
		});
	};

	const repayAmount = async (amount: number) => {
		await repay(amount).then(() => {
			console.log("Finished repaying", amount);
			return Promise.all([reloadStats(), reloadDeposited()]);
		});
	};

	const approveAmount = async (amount: number) => {
		await approveDeposit(amount).then(() => {
			console.log("Finished approving", amount);
			return Promise.all([reloadStats()]);
		});
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
				handle={(action, tokenId) => handle(action, tokenId)}
			/>
			<LendingSummary
				borrowed={vaultData.borrowed}
				deposited={vaultData.deposited}
				available={vaultData.available}
				userBalance={vaultData.userBalance}
				vaultAvailable={vaultData.vault}
			/>
			<LendingForm
				repayLoading={repayLoading}
				borrowLoading={borrowLoading}
				allowance={vaultData.allowance}
				available={vaultData.available}
				balance={vaultData.userBalance}
				approve={(amount) => approveAmount(amount)}
				borrow={(amount) => borrowAmount(amount)}
				repay={(amount) => repayAmount(amount)}
			/>
			<CollateralList
				title="Deposited Collateral"
				collaterals={depositedNFTs}
				handle={(action, tokenId) => handle(action, tokenId)}
			/>
		</div>
	);
};

export default Mint;
