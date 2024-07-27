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
	loading = "loading",
}

export interface CollateralData {
	tokenId: bigint;
	value: bigint;
	status: CollateralStatus;
}
