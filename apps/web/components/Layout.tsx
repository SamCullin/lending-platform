import {
	useAccount,
	useConnect,
	useNetwork,
	useSDK,
} from "@metamask/sdk-react-ui";
import { type PropsWithChildren, useEffect, useState } from "react";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function safeJsonStringify(obj: any, replacer: any = null, space = 2) {
	const seen = new WeakSet();

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	function customReplacer(key: any, value: any) {
		if (typeof value === "object" && value !== null) {
			if (seen.has(value)) {
				return "[Circular]";
			}
			seen.add(value);
		}
		return replacer ? replacer(key, value) : value;
	}

	return JSON.stringify(obj, customReplacer, space);
}

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
	// const [loaded, setLoaded] = useState(false);

	const account = useAccount();
	const isConnected = account.isConnected;
	const address = account.address;
	const metamask = useSDK();
	const network = useNetwork();
	const sdk = metamask.sdk;
	const connected = metamask.connected;

	const { connect } = useConnect();

	console.dir(
		{
			account: JSON.parse(safeJsonStringify(account)),
			metamask,
			network: JSON.parse(safeJsonStringify(network)),
		},
		{
			depth: 4,
		},
	);

	useEffect(() => {
		const synConnected = () => {
			if (!isConnected) {
				console.log(
					"============================================================",
				);
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

	// useEffect(() => {
	// 	if (typeof window !== "undefined" && connected === true) {
	// 		setLoaded(true);
	// 	}
	// }, [connected]);

	return <div className="app-container">{children}</div>;
};
