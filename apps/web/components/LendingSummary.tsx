import {
	CollateralTypeText,
	CollateralsView,
	HeadingText,
} from "./styledComponents/collateral";
import { FlexContainer, FlexItem } from "./styledComponents/general";

interface CollateralsProps {
	borrowed: string;
	deposited: string;
	available: string;
	vaultAvailable: string;
}

const LendingSummary = ({
	borrowed,
	deposited,
	available,
	vaultAvailable,
}: CollateralsProps) => {
	return (
		<CollateralsView>
			<HeadingText>Lending Summary</HeadingText>
			<FlexContainer gap={1}>
				<FlexItem>
					<CollateralTypeText>Borrowed: {borrowed}</CollateralTypeText>
				</FlexItem>
				<FlexItem>
					<CollateralTypeText>Deposited: {deposited}</CollateralTypeText>
				</FlexItem>
				<FlexItem>
					<CollateralTypeText>Available: {available}</CollateralTypeText>
				</FlexItem>
				<FlexItem>
					<CollateralTypeText>
						Vault Liquidity: {vaultAvailable}
					</CollateralTypeText>
				</FlexItem>
			</FlexContainer>
		</CollateralsView>
	);
};

export default LendingSummary;
