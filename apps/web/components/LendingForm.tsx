import { ethers } from "ethers";
import { useState } from "react";
import { fmtValue } from "../utils";
import { CollateralsView, HeadingText } from "./styledComponents/collateral";
import {
	Button,
	ErrorNumberInput,
	FlexContainer,
	FlexItem,
	SmallText,
} from "./styledComponents/general";

interface CollateralsProps {
	borrow: (amount: number) => Promise<void>;
	repay: (amount: number) => Promise<void>;
	approve: (amount: number) => Promise<void>;
	repayLoading: boolean;
	borrowLoading: boolean;
	allowance: bigint | null;
	available: bigint | null;
	balance: bigint | null;
}

const LendingForm = ({
	borrow,
	repay,
	approve,
	repayLoading,
	borrowLoading,
	allowance,
	available,
	balance,
}: CollateralsProps) => {
	const [borrowed, setBorrowed] = useState<string>("");
	const [repaid, setRepaid] = useState<string>("");

	const numBorrowed = ethers.utils.parseEther(borrowed || "0");
	const numRepaid = ethers.utils.parseEther(repaid || "0");

	const bigRepaid = ethers.utils.parseEther(repaid || "0");
	const isApprove =
		allowance === null || ethers.BigNumber.from(allowance).lt(bigRepaid);

	const repayOrApprove = (amount: number) => {
		if (isApprove) {
			return approve(amount);
		}
		return repay(amount).then(() => setRepaid(""));
	};

	const handleBorrowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === "" || !Number.isNaN(Number(value))) {
			setBorrowed(value);
		}
	};

	const handleRepayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === "" || !Number.isNaN(Number(value))) {
			setRepaid(value);
		}
	};

	const borrowError = available !== null && numBorrowed.gt(available);
	const repayError = balance !== null && numRepaid.gt(balance);

	return (
		<CollateralsView>
			<HeadingText>Lending Form</HeadingText>
			<FlexContainer gap={1}>
				<FlexItem>
					<ErrorNumberInput
						error={borrowError}
						value={borrowed}
						onChange={handleBorrowChange}
					/>
					<Button
						onClick={() => borrow(Number(borrowed)).then(() => setBorrowed(""))}
					>
						{borrowLoading ? "Running" : "Borrow"}
					</Button>
					<SmallText>
						Available Amount: {available ? fmtValue(available) : "..."}
					</SmallText>
				</FlexItem>
				<FlexItem>
					<ErrorNumberInput
						error={repayError}
						value={repaid}
						onChange={handleRepayChange}
					/>
					<Button onClick={() => repayOrApprove(Number(repaid))}>
						{repayLoading ? "Running" : isApprove ? "Approve" : "Repay"}
					</Button>
					<SmallText>
						Approved Amount: {allowance ? fmtValue(allowance) : "..."}
					</SmallText>
				</FlexItem>
			</FlexContainer>
		</CollateralsView>
	);
};

export default LendingForm;
