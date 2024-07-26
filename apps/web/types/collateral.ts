export enum CollateralAction {
	approve = "approve",
	deposit = "deposit",
	withdraw = "withdraw",
}

export enum CollateralStatus {
	owned = "owned",
	approved = "approved",
	deposited = "deposited",
	locked = "locked",
}

export interface CollateralData {
	tokenId: string;
	value: string;
	status: CollateralStatus;
}
