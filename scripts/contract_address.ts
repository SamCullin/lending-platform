import { $ } from "bun";

const [, , in_chainId] = process.argv;

const chainId = in_chainId || "31337";

const loadContractDetails = async (chainId: string) => {
	const file = `./apps/blockchain/broadcast/DeployContracts.s.sol/${chainId}/run-latest.json`;
	const data = await Bun.file(file).text();
	const { transactions } = JSON.parse(data);
	const contractNameMapping = {
		MockStableCoin: "stable",
		CollateralVault: "collateral",
		LendingBorrowing: "lending",
	};
	const contracts = transactions
		.filter((tx) => tx.transactionType === "CREATE")
		.map((tx) => {
			return {
				address: tx.contractAddress,
				name: tx.contractName,
				type: contractNameMapping[tx.contractName],
			};
		})
		.reduce((acc, contract) => {
			acc[contract.type] = contract;
			return acc;
		}, {});
	return contracts;
};

await $`docker compose run --rm deployer`;
const contracts = await loadContractDetails(chainId);
console.log(contracts);

await Bun.write(
	"./apps/web/lib/contract.config.ts",
	`
export const contractAddresses = ${JSON.stringify(contracts, null, 4)};    
`,
);
