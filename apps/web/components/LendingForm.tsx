import { CollateralsView, HeadingText } from "./styledComponents/collateral";
import {
	Button,
	FlexContainer,
	FlexItem,
	NumberInput,
} from "./styledComponents/general";

interface CollateralsProps {
	other?: string;
}

const LendingForm = ({ other }: CollateralsProps) => {
	const repay = () => {};

	const borrow = () => {};
	return (
		<CollateralsView>
			<HeadingText>Lending Form</HeadingText>
			<FlexContainer gap={1}>
				<FlexItem>
					<NumberInput />
					<Button onClick={() => borrow()}>Borrow</Button>
				</FlexItem>
				<FlexItem>
					<NumberInput />
					<Button onClick={() => repay()}>Repay</Button>
				</FlexItem>
			</FlexContainer>
		</CollateralsView>
	);
};

export default LendingForm;
