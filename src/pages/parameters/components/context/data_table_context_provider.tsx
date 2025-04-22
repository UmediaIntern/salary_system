import React, { useContext, useState, type PropsWithChildren } from "react";
import { type FunctionMode } from "./data_table_context";
import {
	type ParameterTableEnum,
	ParameterTableEnumValues,
} from "../../parameter_tables";
import { TabsEnum, type TabsEnumType } from "./tabs_enum";
import { type Table } from "@tanstack/react-table";

interface DataTableContextProviderProps { }

export type TableObject = {
	table: Table<any>;
};

const dataTableContext = React.createContext<{
	selectedTableType: ParameterTableEnum;
	setSelectedTableType: (table: ParameterTableEnum) => void;
	selectedTab: TabsEnumType;
	setSelectedTab: (tab: TabsEnumType) => void;
	selectedTable: TableObject | null;
	setSelectedTable: (table: TableObject | null) => void;
	mode: FunctionMode;
	setMode: (mode: FunctionMode) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	data: any;
	setData: (data: any) => void;
} | null >(null);


export function DataTableContextProvider({
	children,
}: PropsWithChildren<DataTableContextProviderProps>) {
	const [selectedTableType, setSelectedTableType] = useState<ParameterTableEnum>(ParameterTableEnumValues[0]);
	const [selectedTab, setSelectedTab] = useState<TabsEnumType>(TabsEnum.Enum.current);
	const [selectedTable, setSelectedTable] = useState<TableObject | null>(null);
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");
	const [data, setData] = useState<any>(null);

	return (
		<dataTableContext.Provider
			value={{
				selectedTableType,
				setSelectedTableType,
				selectedTab,
				setSelectedTab,
				selectedTable,
				setSelectedTable,
				mode,
				setMode,
				open,
				setOpen,
				data,
				setData,
			}}
		>
			{children}
		</dataTableContext.Provider>
	);
}

export function useDataTableContext() {
	const context = useContext(dataTableContext);
	if (context === null) {
		throw new Error(
			"Data Table Context must be used within a DataTableContextProvider"
		);
	}
	return context;
}
