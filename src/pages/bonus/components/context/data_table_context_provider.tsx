import React, { useContext, useState, type PropsWithChildren } from "react";
import dataTableContext, { FunctionMode } from "./data_table_context";
import {
	BonusTableEnumValues,
} from "../../bonus_tables";
import { type Table } from "@tanstack/react-table";
import { bonusTypeEnum, type BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { type TableEnum } from "./data_table_enum";

interface DataTableContextProviderProps { }

export type TableObject = {
	table: Table<any>;
};

export default function DataTableContextProvider({
	children,
}: PropsWithChildren<DataTableContextProviderProps>) {
	const [selectedTableType, setSelectedTableType] =
		useState<TableEnum>(BonusTableEnumValues[0]);
	const [selectedBonusType, setSelectedBonusType] = useState<BonusTypeEnumType>(
		Object.values(bonusTypeEnum.Enum)[0]!
	);
	const [selectedTable, setSelectedTable] = useState<TableObject | null>(
		null
	);
	const [openSheet, setOpenSheet] = useState<boolean>(false);
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");
	const [data, setData] = useState<any>(null);

	return (
		<dataTableContext.Provider
			value={{
				selectedTableType,
				setSelectedTableType,
				selectedBonusType,
				setSelectedBonusType,
				selectedTable,
				setSelectedTable,
				mode,
				setMode,
				openSheet,
				setOpenSheet,
				openDialog,
				setOpenDialog,
				data,
				setData,
			}}
		>
			{children}
		</dataTableContext.Provider>
	);
}


export function useBonusFunctionContext() {
	const context = useContext(dataTableContext);
	if (context === null) {
		throw new Error(
			"useBonusFunctionContext must be used within a DataTableContextProvider in bonus page"
		);
	}
	return context;
}