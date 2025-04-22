import {
	createContext,
	useContext,
	type PropsWithChildren,
} from "react";
import { type AccessFEType } from "~/server/api/types/access_page_type";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../loading";

const accessContext = createContext<{ access: AccessFEType } | null>(null);

export function AccessContextProvider({ children }: PropsWithChildren) {
	const { isSuccess, data } = api.access.accessByRole.useQuery();

    if (!isSuccess) {
        return <LoadingSpinner />;
    }

	return (
		<accessContext.Provider
			value={{
				access: data
			}}
		>
			{children}
		</accessContext.Provider>
	);
}

export function useAccessContext() {
	const context = useContext(accessContext);
	if (context === null) {
		throw new Error(
			"Access Context must be used within a AccessContextProvider"
		);
	}
	return context;
}
