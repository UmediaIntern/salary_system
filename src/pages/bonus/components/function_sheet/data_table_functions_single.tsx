import { useContext } from "react";
import dataTableContext from "../context/data_table_context";
import { FunctionsComponent } from "~/components/data_table/functions_component";

export function DataTableFunctions() {
	const { setOpen, setMode, data, setData } = useContext(dataTableContext);

	return (
		<FunctionsComponent
			setOpen={setOpen}
			setMode={setMode}
			data={data}
			setData={setData}
		/>
	);
}

