import {
	createContext,
	useState,
	useContext,
	type PropsWithChildren,
} from "react";
import { z } from "zod";

export const roleTabEnum = z.enum(["roles", "accounts"]);
type RoleTabEnumType = z.infer<typeof roleTabEnum>;

const roleCommandContext = createContext<{
	selectedTab: RoleTabEnumType;
	setSelectedTab: (tab: RoleTabEnumType) => void;
} | null>(null);

export function RoleCommandContextProvider({ children }: PropsWithChildren) {
	const [selectedTab, setSelectedTab] = useState<RoleTabEnumType>("roles");

	return (
		<roleCommandContext.Provider
			value={{
				selectedTab,
				setSelectedTab,
			}}
		>
			{children}
		</roleCommandContext.Provider>
	);
}

export function useRoleCommandContext() {
	const context = useContext(roleCommandContext);
	if (context === null) {
		throw new Error(
			"Role Command Context must be used within a RoleCommandContextProvider"
		);
	}
	return context;
}
