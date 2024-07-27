import "normalize.css";
import "../styles/globals.scss";

import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";
import type { AppProps } from "next/app";
import { Layout } from "../components/Layout";
import useFullURL from "../hooks/useFullUrl";

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
					contracts: {
						lending: {
							address: "0xc98CD2Abff37eAF3feF2433D2B96274D57e710f5",
						},
						stable: {
							address: "0x3EDFCe3F690b5E4A238ee94e008e1db3525c932B",
						},
						collateral: {
							address: "0xb1bFa879aE77580353aC28A7c536cd2E3d38973E",
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
