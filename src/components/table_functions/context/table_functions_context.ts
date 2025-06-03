import React, { useState } from "react";

interface TableFunctionContext<TMode, TData> {
	mode: TMode;
	setMode: (mode: TMode) => void;
	openSheet: boolean;
	setOpenSheet: (open: boolean) => void;
	openDialog: boolean;
	setOpenDialog: (open: boolean) => void;
	data: TData | null;
	setData: (data: TData) => void;
}

export function createTableFunctionContext<TMode, TData, T extends object = object>() {
	return React.createContext<(TableFunctionContext<TMode, TData> & T) | null>(
		null
	);
}

export function useTableFunctionState<TMode, TData>(initialMode: TMode) {
	const [openSheet, setOpenSheet] = useState<boolean>(false);
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [mode, setMode] = useState<TMode>(initialMode);
	const [data, setData] = useState<TData | null>(null);

	return { openSheet, setOpenSheet, openDialog, setOpenDialog, mode, setMode, data, setData };
}
