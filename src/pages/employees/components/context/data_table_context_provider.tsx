import { createContext, useContext, useState, type PropsWithChildren } from "react";
import {
	type EmployeeTableEnum,
	EmployeeTableEnumValues,
} from "../../employee_tables";
import { type Table } from "@tanstack/react-table";
import { EmpTabsEnum, type EmpTabsEnumType } from "./employee_tabs_enum";


type EmpTableObject = {
	table: Table<any>;
};

interface EmployeeTableContextType {
	period_id: number
	selectedTableType: EmployeeTableEnum;
	setSelectedTableType: (table: EmployeeTableEnum) => void;
	selectedTab: EmpTabsEnumType;
	setSelectedTab: (tab: EmpTabsEnumType) => void;
	selectedTable: EmpTableObject | null;
	setSelectedTable: (table: EmpTableObject | null) => void;
}
const dataTableContext = createContext<EmployeeTableContextType | null>(null);

interface DataTableContextProviderProps {
	period_id: number;
}

export function EmployeeTableContextProvider({
	period_id,
	children,
}: PropsWithChildren<DataTableContextProviderProps>) {
	const [selectedTableType, setSelectedTableType] =
		useState<EmployeeTableEnum>(EmployeeTableEnumValues[0]);

	const [selectedTab, setSelectedTab] = useState<EmpTabsEnumType>(
		EmpTabsEnum.Enum.current
	);

	const [selectedTable, setSelectedTable] = useState<EmpTableObject | null>(
		null
	);

	return (
		<dataTableContext.Provider
			value={{
				period_id,
				selectedTableType,
				setSelectedTableType,
				selectedTab,
				setSelectedTab,
				selectedTable,
				setSelectedTable,
			}}
		>
			{children}
		</dataTableContext.Provider>
	);
}

export function useEmployeeTableContext() {
	const context = useContext(dataTableContext);
	if (context === null) {
		throw new Error(
			"useEmployeeTableContext must be used within a EmployeeTableContextProvider"
		);
	}
	return context;
}
