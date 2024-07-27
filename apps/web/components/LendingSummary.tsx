import { fmtValue } from "../utils";
import {
	CollateralTypeText,
	CollateralsView,
	HeadingText,
} from "./styledComponents/collateral";
import { FlexContainer, FlexItem } from "./styledComponents/general";

interface CollateralsProps {
	borrowed: bigint | null;
	deposited: bigint | null;
	available: bigint | null;
	vaultAvailable: bigint | null;
	userBalance: bigint | null;
}

const LendingSummary = ({
	borrowed,
	deposited,
	vaultAvailable,
	userBalance,
}: CollateralsProps) => {
	return (
		<CollateralsView>
			<HeadingText>Lending Summary</HeadingText>
			<FlexContainer gap={1}>
				<FlexItem>
					<CollateralTypeText>
						Borrowed: {borrowed ? fmtValue(borrowed) : "..."}
					</CollateralTypeText>
				</FlexItem>
				<FlexItem>
					<CollateralTypeText>
						Deposited: {deposited ? fmtValue(deposited) : "..."}
					</CollateralTypeText>
				</FlexItem>
				<FlexItem>
					<CollateralTypeText>
						Balance: {userBalance ? fmtValue(userBalance) : "..."}
					</CollateralTypeText>
				</FlexItem>
				<FlexItem>
					<CollateralTypeText>
						Vault Liquidity: {vaultAvailable ? fmtValue(vaultAvailable) : "..."}
					</CollateralTypeText>
				</FlexItem>
			</FlexContainer>
		</CollateralsView>
	);
};

export default LendingSummary;
