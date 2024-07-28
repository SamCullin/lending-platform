import { $ } from "bun";

const [, , ...args] = process.argv;

const NO_DEPLOY = args.includes("--no-deploy");
const chainId =
	args.find((arg) => arg.startsWith("--chainId="))?.split("=")[1] ?? "31337";

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

if (!NO_DEPLOY) {
	await $`docker compose run --rm deployer`;
}

const contracts = await loadContractDetails(chainId);
console.log(contracts);

await Bun.write(
	"./apps/web/lib/contract.config.ts",
	`
export const contractAddresses = ${JSON.stringify(contracts, null, 4)};    
`,
);
