import { cn } from "~/lib/utils";
import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";

import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { type TableEnum, getTableNameKey } from "../context/data_table_enum";
import { modeDescription } from "~/lib/utils/helper_function";
import { ParameterExcelDownloader } from "../excel_download/parameter_excel_downloader";
import { ParameterExcelUpload } from "../excel_upload/parameter_excel_uplaod";
import { ParameterForm } from "./parameter_form";
import { ScrollArea } from "~/components/ui/scroll-area";
import { FunctionMenuOption } from "~/components/table_functions/function_menu/function_menu_option";
import { useDataTableContext } from "../context/data_table_context_provider";
import { getSchema } from "../../schemas/get_schemas";
import { AutoParameterForm } from "../../schemas/auto_parameter_form";

interface DataTableFunctionsProps extends React.HTMLAttributes<HTMLDivElement> {
	tableType: TableEnum;
}

// TODO: remove
type FunctionMode =
	| "create"
	| "update"
	| "delete"
	| "excel_download"
	| "excel_upload"
	| "none";

export function DataTableFunctions({
	tableType,
	className,
}: DataTableFunctionsProps) {
	const { t } = useTranslation(["common", "nav"]);
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");
	const { enableFunctions } = useDataTableContext();

	// ========================= Additional Condition for Schema =====================================
	const schema = getSchema(tableType);

	return (
		<div className={cn(className, "flex h-full items-center")}>
			<Dialog open={open} onOpenChange={setOpen}>
				{/* Dropdown */}
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="ml-auto h-8 lg:flex"
						>
							<EllipsisVertical className="cursor-pointer stroke-[1.5]" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[120px]">
						<DropdownMenuLabel>
							{t("others.functions")}
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<FunctionMenuOption.ExcelDownload
							disabled={!enableFunctions}
							onClick={() => {
								setMode("excel_download");
								setOpen(true);
							}}
						/>
						<FunctionMenuOption.ExcelUpload
							disabled={!enableFunctions}
							onClick={() => {
								setMode("excel_upload");
								setOpen(true);
							}}
						/>
						<FunctionMenuOption.Create
							disabled={!enableFunctions}
							onClick={() => {
								setMode("create");
								setOpen(true);
							}}
						/>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* Sheet */}
				{mode == "excel_download" && (
					<ParameterExcelDownloader table_name={tableType} />
				)}
				{mode == "excel_upload" && (
					<ParameterExcelUpload
						tableType={tableType}
						closeDialog={() => setOpen(false)}
					/>
				)}
				{mode == "create" && (
					<DialogContent className={cn("h-[90vh]")}>
						<ScrollArea className="h-full w-full">
							<DialogHeader>
								<DialogTitle>
									{`${t(`button.${mode}`)!}${t(
										"button.form"
									)} (${t(getTableNameKey(tableType))})`}
								</DialogTitle>
								<DialogDescription>
									{modeDescription(t, mode)}
								</DialogDescription>
							</DialogHeader>
							<AutoParameterForm />
						</ScrollArea>
					</DialogContent>
				)}
			</Dialog>
		</div>
	);
}
