import React, { useState } from "react";

interface TableFunctionContext<TMode, TData> {
	mode: TMode;
	setMode: (mode: TMode) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	data: TData | null;
	setData: (data: TData) => void;
	openDialog: boolean;
	setOpenDialog: (open: boolean) => void;
}

export function createTableFunctionContext<TMode, TData, T extends object = object>() {
	return React.createContext<(TableFunctionContext<TMode, TData> & T) | null>(
		null
	);
}

export function useTableFunctionState<TMode, TData>(initialMode: TMode) {
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<TMode>(initialMode);
	const [data, setData] = useState<TData | null>(null);
  const [ openDialog, setOpenDialog ] = useState<boolean>(false);

	return { open, setOpen, mode, setMode, data, setData, openDialog,setOpenDialog };
}
