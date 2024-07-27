import { SiEthereum } from "react-icons/si";

import {
    useAccount,
    useConnect,
    useDisconnect,
    useSDK,
} from "@metamask/sdk-react-ui";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useSwitchOrAddNetwork } from "../hooks/useSwitchOrAddNetwork";
import { formatAddress } from "../utils";
import { Button, FlexContainer, FlexItem } from "./styledComponents/general";
import {
    Balance,
    Logo,
    NavigationView,
    RightNav,
} from "./styledComponents/navigation";

const Connect = () => {
	const { sdk, balance, balanceProcessing, ready, connecting, chainId } =
		useSDK();
	const { address, isConnected, isConnecting } = useAccount();

	const [isWongNetwork, setWrongNetwork] = useState<null | boolean>(null);

	const { chains, switchOrAddNetwork } = useSwitchOrAddNetwork();

	const { connect } = useConnect();
	const { disconnectAsync } = useDisconnect();

	useEffect(() => {
		if (chainId) {
			const match = chains.find(
				(c) => c.sourceId && `0x${c.sourceId.toString(16)}` === chainId,
			);
			if (match) {
				setWrongNetwork(false);
			} else {
				setWrongNetwork(true);
			}
		}
	}, [chainId, chains]);

	const switchNetwork = async () => {
		chains.map((c) => {
			console.log(
				c.name,
				c.sourceId,
				`0x${c.sourceId?.toString(16)}`.toLocaleLowerCase(),
			);
		});
		const network = chains.find(
			(c) =>
				c.sourceId &&
				`0x${c.sourceId.toString(16)}`.toLocaleLowerCase() ===
					process.env.NEXT_PUBLIC_NETWORK_ID?.toLocaleLowerCase(),
		);
		if (!network) {
			throw new Error(
				`App Config Broken: Network not found ${process.env.NEXT_PUBLIC_NETWORK_ID}`,
			);
		}
        console.dir(network)
		await switchOrAddNetwork(network);
	};

	let status = "connect";
	if (isConnected && !isWongNetwork) {
		status = "connected";
	} else if (isConnected && isWongNetwork) {
		status = "switchNetwork";
	} else if (connecting || isConnecting || ready === false) {
		status = "loading";
	} else if (!isConnected) {
		status = "connect";
	}

	return (
		<>
			{status === "connect" && (
				<Button
					textSize={10}
					marginR={1}
					onClick={() => {
						console.log("Connect");
						sdk?.connect().then(() => connect());
					}}
				>
					Connect
				</Button>
			)}
			{status === "loading" && (
				<Button textSize={10} marginR={1} disabled={true}>
					loading...
				</Button>
			)}
			{status === "connected" && (
				<>
					<Button
						textSize={10}
						marginR={1}
						onClick={() => {
							console.log("disconnect");
							disconnectAsync().then(() => sdk?.terminate());
						}}
					>
						Disconnect
					</Button>
					{!!address && (
						<Link
							className="text_link tooltip-bottom"
							href={`https://etherscan.io/address/${address}`}
							target="_blank"
							data-tooltip="Open in Block Explorer"
						>
							{formatAddress(address)}
						</Link>
					)}
					{!!balance && (
						<Balance>{Number.parseInt(balance, 16) / 10 ** 18} ETH</Balance>
					)}
				</>
			)}
			{status === "switchNetwork" && (
				<Button textSize={10} marginR={1} onClick={switchNetwork}>
					Switch Network
				</Button>
			)}
			{status === "installMetaMask" && (
				<Button href="https://metamask.io" target="_blank">
					Install MetaMask
				</Button>
			)}
		</>
	);
};

const Navigation = () => {
	return (
		<NavigationView>
			<FlexContainer>
				<FlexItem widthPercent={50}>
					<Logo>
						<SiEthereum /> NFT Lender
					</Logo>
				</FlexItem>
				<FlexItem widthPercent={50}>
					<RightNav>
						<Connect />
					</RightNav>
				</FlexItem>
			</FlexContainer>
		</NavigationView>
	);
};

export default Navigation;
