import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { type Table } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

interface DataTableViewOptionsProps<TData>
	extends React.HTMLAttributes<HTMLDivElement> {
	table: Table<TData>;
}

export function DataTableViewOptions<TData>({
	table,
	className,
}: DataTableViewOptionsProps<TData>) {
	const { t } = useTranslation(['common']);

	if (!table) {
		return <div />;
	}

	return (
		<div className={cn(className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="ml-auto w-20 h-8"
					>
						<div className="flex items-center">
							<MixerHorizontalIcon className="mr-2 h-4 w-4" />
							{t("table.view")}
						</div>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-y-auto">
					<ScrollArea>
						<DropdownMenuLabel>{t("others.visible_columns")}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{table
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
										{t(`table.${column.id}`)}
									</DropdownMenuCheckboxItem>
								);
							})}
					</ScrollArea>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
