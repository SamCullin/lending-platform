import "normalize.css";
import "../styles/globals.scss";

import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";
import type { AppProps } from "next/app";
import { Layout } from "../components/Layout";
import useFullURL from "../hooks/useFullUrl";
import { contractAddresses } from "../lib/contract.config";

function MyApp({ Component, pageProps }: AppProps) {
	const fullUrl = useFullURL();
	console.log(fullUrl);

	return (
		<MetaMaskUIProvider
			debug={true}
			networks={[
				{
					id: 31337,
					sourceId: 31337,
					name: "Anvil Local",
					nativeCurrency: {
						name: "Anvil",
						symbol: "ANV",
						decimals: 18,
					},
					rpcUrls: {
						default: {
							http: ["http://localhost:8545"],
						},
					},
					contracts: contractAddresses,
				},
			]}
			sdkOptions={{
				dappMetadata: {
					name: "Lending Dapp",
					url: fullUrl,
				},
				infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
			}}
		>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</MetaMaskUIProvider>
	);
}

export default MyApp;
