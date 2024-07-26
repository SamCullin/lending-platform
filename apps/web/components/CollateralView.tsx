import {
	CollateralAction,
	type CollateralData,
	CollateralStatus,
} from "../types/collateral";
import {
	CollateralType,
	CollateralTypeText,
	CollateralsView,
	HeadingText,
} from "./styledComponents/collateral";
import { Button, FlexContainer, FlexItem } from "./styledComponents/general";

export interface CollateralProps extends CollateralData {
	handle: (action: CollateralAction, tokenId: string) => void;
}
interface CollateralsProps {
	title: string;
	handle: (action: CollateralAction, tokenId: string) => void;
	collaterals: CollateralData[];
}

const CollateralNFT: React.FC<CollateralProps> = ({
	tokenId,
	value,
	status,
	handle,
}) => {
	return (
		<FlexItem>
			<CollateralType>
				<CollateralTypeText>{tokenId}</CollateralTypeText>
				<p>{value} USD</p>
				{status === CollateralStatus.owned && (
					<Button onClick={() => handle(CollateralAction.approve, tokenId)}>
						Approve Deposit
					</Button>
				)}
				{status === CollateralStatus.approved && (
					<Button onClick={() => handle(CollateralAction.deposit, tokenId)}>
						Deposit
					</Button>
				)}
				{status === CollateralStatus.deposited && (
					<Button onClick={() => handle(CollateralAction.withdraw, tokenId)}>
						Withdraw
					</Button>
				)}
				{status === CollateralStatus.locked && (
					<Button disabled={true}>Locked</Button>
				)}
			</CollateralType>
		</FlexItem>
	);
};

const CollateralList = ({ title, collaterals, handle }: CollateralsProps) => {
	return (
		<CollateralsView>
			<HeadingText>{title}</HeadingText>
			<FlexContainer gap={1}>
				{collaterals.map((collateral) => (
					<CollateralNFT
						key={collateral.tokenId}
						{...collateral}
						handle={handle}
					/>
				))}
			</FlexContainer>
		</CollateralsView>
	);
};

export default CollateralList;
