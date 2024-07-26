import "normalize.css";
import "../styles/globals.scss";

import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";
import type { AppProps } from "next/app";
import React from "react";
import { Layout } from "../components/Layout";
import useFullURL from "../hooks/useFullUrl";

function MyApp({ Component, pageProps }: AppProps) {
	const fullUrl = useFullURL();
	console.log(fullUrl);

	return (
		<MetaMaskUIProvider
			debug={false}
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
					contracts: {
						lending: {
							address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
						},
						stable: {
							address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
						},
						collateral: {
							address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
						},
					},
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
