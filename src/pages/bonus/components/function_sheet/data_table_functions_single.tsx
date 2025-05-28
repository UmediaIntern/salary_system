import { useContext } from "react";
import dataTableContext from "../context/data_table_context";
import { FunctionsComponent } from "~/components/data_table/functions_component";

export function DataTableFunctions() {
	const { setOpenSheet, setOpenDialog, setMode, data, setData } = useContext(dataTableContext);

	return (
		<FunctionsComponent
			setOpenSheet={setOpenSheet}
			setOpenDialog={setOpenDialog}
			setMode={setMode}
			data={data}
			setData={setData}
		/>
	);
}

