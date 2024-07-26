import { useState } from "react";

export const useReset = () => {
	const [state, setState] = useState(true);

	return [state, () => setState((prev) => !prev)] as const;
};
