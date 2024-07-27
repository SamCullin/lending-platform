import { useAccount, useConnect, useSDK } from "@metamask/sdk-react-ui";
import { type PropsWithChildren, useEffect } from "react";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
	const account = useAccount();
	const isConnected = account.isConnected;
	const metamask = useSDK();
	const sdk = metamask.sdk;
	const connected = metamask.connected;

	const { connect } = useConnect();

	useEffect(() => {
		const synConnected = () => {
			if (!isConnected) {
				connect();
			}
		};

		if (connected && typeof metamask.account === "string" && !isConnected) {
			// force synchronize state between sdk and wagmi
			synConnected();
		} else if (!connected) {
			sdk?.getProvider()?.once("_initialized", synConnected);
		}

		return () => {
			sdk?.getProvider()?.removeListener("_initialized", synConnected);
		};
	}, [sdk, connected, metamask.account, isConnected, connect]);

	return <div className="app-container">{children}</div>;
};
