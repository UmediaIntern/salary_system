import { LoadingSpinner } from "~/components/loading";
import { useDataTableContext } from "~/pages/parameters/components/context/data_table_context_provider";

interface DataTableToolbarProps<TData> {
	filterColumnKey?: keyof TData;
}

export function DataTableToolbar<TData>({}: DataTableToolbarProps<TData>) {
	const { selectedTable } = useDataTableContext();
	const table = selectedTable?.table;

	if (!table) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}
}
