import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { useContext, useEffect } from "react";
import { Button } from "~/components/ui/button";

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import dataTableContext from "~/pages/parameters/components/context/data_table_context";

interface DataTableViewOptionsProps<TData>
	extends React.HTMLAttributes<HTMLDivElement> {}

export function DataTableViewOptions<TData>({
	className,
}: DataTableViewOptionsProps<TData>) {
	const { selectedTable } = useContext(dataTableContext);

	if (!selectedTable) {
		return <div />;
	}

	useEffect(() => {
		selectedTable.resetColumnVisibility();
	}, [selectedTable]);

	return (
		<div className={cn(className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="ml-auto hidden h-8 lg:flex"
					>
						<MixerHorizontalIcon className="mr-2 h-4 w-4" />
						View
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[150px]">
					<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{selectedTable!
						.getAllColumns()
						.filter(
							(column) =>
								typeof column.accessorFn !== "undefined" &&
								column.getCanHide()
						)
						.map((column) => {
							return (
								<DropdownMenuCheckboxItem
									key={column.id}
									className="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={(value) => {
										column.toggleVisibility(value);
									}}
								>
									{column.id}
								</DropdownMenuCheckboxItem>
							);
						})}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
