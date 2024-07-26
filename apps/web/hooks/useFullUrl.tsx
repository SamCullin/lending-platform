import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useFullURL = () => {
	const router = useRouter();
	const [fullURL, setFullURL] = useState("");

	useEffect(() => {
		if (typeof window !== "undefined") {
			const currentURL = `${window.location.protocol}//${window.location.host}${router.asPath}`;
			setFullURL(currentURL);
		}
	}, [router.asPath]);

	return fullURL;
};

export default useFullURL;
