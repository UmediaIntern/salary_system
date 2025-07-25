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
import { ScrollArea } from "~/components/ui/scroll-area";
import { FunctionMenuOption } from "~/components/table_functions/function_menu/function_menu_option";
import { useDataTableContext } from "../context/data_table_context_provider";
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
	const [mode, setMode] = useState<FunctionMode>("none");
	const { enableFunctions, setData, openDialog, setOpenDialog } = useDataTableContext();

	// ========================= Additional Condition for Schema =====================================

	return (
		<div className={cn(className, "flex h-full items-center")}>
			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
								setOpenDialog(true);
							}}
						/>
						<FunctionMenuOption.ExcelUpload
							disabled={!enableFunctions}
							onClick={() => {
								setMode("excel_upload");
								setOpenDialog(true);
							}}
						/>
						<FunctionMenuOption.Create
							disabled={!enableFunctions}
							onClick={() => {
								setData(null);
								setMode("create");
								setOpenDialog(true);
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
						closeDialog={() => setOpenDialog(false)}
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
