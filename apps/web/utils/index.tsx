import { ethers } from "ethers";
export const fmtValue = (value: string | bigint | ethers.BigNumber) => {
	const formattedValue = ethers.utils.formatUnits(value, 18);
	const fixedValue = Number.parseFloat(formattedValue).toFixed(2);
	return fixedValue;
};

export const fmtChainAsNum = (chainIdHex: string) => {
	const chainIdNum = Number.parseInt(chainIdHex);
	return chainIdNum;
};

export const fmtNftId = (nftId: string | bigint | ethers.BigNumber) => {
	return ethers.BigNumber.from(nftId).toHexString();
};

export const fmtAddress = (addr: string) => {
	return `${addr.substring(0, 5)}...${addr.substring(39)}`;
};
