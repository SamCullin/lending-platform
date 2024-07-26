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
							address: "0xA8452Ec99ce0C64f20701dB7dD3abDb607c00496",
						},
						stable: {
							address: "0x34A1D3fff3958843C43aD80F30b94c510645C316",
						},
						collateral: {
							address: "0x90193C961A926261B756D1E5bb255e67ff9498A1",
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
