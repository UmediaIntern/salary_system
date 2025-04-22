import { FunctionsComponent } from "~/components/data_table/functions_component";
import { useDataTableContext } from "../context/data_table_context_provider";

export function DataTableFunctions() {
	const { setOpen, setMode, data, setData, enableFunctions } = useDataTableContext();

	return (
		<FunctionsComponent
			setOpen={setOpen}
			setMode={setMode}
			data={data}
			setData={setData}
      disabled={!enableFunctions}
		/>
	);
}
