import type { Abi } from "abitype";
import { ethers } from "ethers";
import type { TypedContract } from "ethers-abitype";
import { collateralAbi, lendingAbi, mockStableAbi } from "./lib/contracts";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

const addresses = {
	lending: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
	stable: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
	collateral: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
};

export const getContract = <T extends Abi>(
	address: string,
	signer: ethers.providers.Provider | ethers.Signer,
	abi: T,
) => {
	console.log("Creating Contract", address);
	return new ethers.Contract(
		address,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		abi as any,
		signer,
	) as unknown as TypedContract<T>;
};

const collateralContract = getContract(
	addresses.collateral,
	provider,
	collateralAbi,
);
const lendingContract = getContract(addresses.lending, provider, lendingAbi);
const stableContract = getContract(addresses.stable, provider, mockStableAbi);

const output = await stableContract.balanceOf(lendingContract.address);
console.log(output.toString());
