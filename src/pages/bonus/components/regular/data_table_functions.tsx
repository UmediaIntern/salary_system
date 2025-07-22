import { cn } from "~/lib/utils";
import { useContext, useState } from "react";
import { EllipsisVertical, CirclePlus } from "lucide-react";
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

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { type TableEnum, getTableNameKey } from "../context/data_table_enum";
import { getSchema } from "../../schemas/get_schemas";
import { modeDescription } from "~/lib/utils/helper_function";
import { type BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { type FunctionMode } from "../context/data_table_context";
import { BonusExcelDownloader } from "../excel_download/bonus_excel_downloader";
import { BonusExcelUpload } from "../excel_upload/bonus_excel_upload";
import {
	FunctionMenuOption,
	FunctionMenuOptionBase,
} from "~/components/table_functions/function_menu/function_menu_option";
import { ZodObject } from "zod";
import { BonusForm } from "../function_sheet/bonus_form";

interface DataTableFunctionsProps extends React.HTMLAttributes<HTMLDivElement> {
	tableType: TableEnum;
	bonusType: BonusTypeEnumType;
}

export function DataTableFunctions({
	tableType,
	bonusType,
	className,
}: DataTableFunctionsProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");
	const { t } = useTranslation(["common", "nav"]);

	// ========================= Additional Condition for Schema =====================================
	const schema = getSchema(tableType);
	const baseSchema = schema as ZodObject<any>; // or a more specific type

	return (
		<div className={cn(className, "flex h-full items-center")}>
			<Dialog open={open} onOpenChange={setOpen}>
				{/* Dropdown */}
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="ml-auto h-8"
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
							onClick={() => {
								setMode("excel_download");
								setOpen(true);
							}}
						/>
						<FunctionMenuOption.ExcelUpload
							onClick={() => {
								setMode("excel_upload");
								setOpen(true);
							}}
						/>
						<FunctionMenuOptionBase
							onClick={() => {
								setMode("create");
								setOpen(true);
							}}
							itemName={t("button.create_with_blank")}
							icon={CirclePlus}
						/>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* Sheet */}
				{mode == "excel_download" && (
					<BonusExcelDownloader
						table_name={tableType}
						bonus_type={bonusType}
					/>
				)}
				{mode == "excel_upload" && (
					<BonusExcelUpload
						tableType={tableType}
						closeDialog={() => setOpen(false)}
					/>
				)}

				{mode != "excel_download" && mode != "excel_upload" && (
					<DialogContent className="w-[60%]">
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
						{(mode == "create" || mode == "update") && (
							<ScrollArea className="h-full w-full">
								{mode == "create" && <BonusForm
									formSchema={baseSchema.omit({ id: true as const})}
									// formConfig={[
									// 	{ key: "id", config: { hidden: true } },
									// ]}
									mode={mode}
									closeSheet={() => setOpen(false)}
								/>}
								{mode == "update" && <BonusForm
									formSchema={schema}
									formConfig={[
										{ key: "id", config: { hidden: true } },
									]}
									mode={mode}
									closeSheet={() => setOpen(false)}
								/>}
								<ScrollBar orientation="horizontal" />
							</ScrollArea>
						)}
					</DialogContent>
				)}
			</Dialog>
		</div>
	);
}

// function BatchCreateForm({
// 	tableType,
// 	bonusType,
// 	schema,
// 	setOpen,
// }: {
// 	tableType: TableEnum;
// 	bonusType: BonusTypeEnumType;
// 	schema: any;
// 	setOpen: (open: boolean) => void;
// }) {
// 	const mode = "batch_create";
// 	if (tableType == "TableBonusWorkType")
// 		return (
// 			<BonusWorkTypeBatchCreateForm
// 				bonusType={bonusType}
// 				formSchema={z.object({ content: z.array(schema) })}
// 				mode={mode}
// 				closeSheet={() => setOpen(false)}
// 			/>
// 		);
// 	if (tableType == "TableBonusDepartment")
// 		return (
// 			<BonusDepartmentBatchCreateForm
// 				bonusType={bonusType}
// 				formSchema={z.object({ content: z.array(schema) })}
// 				mode={mode}
// 				closeSheet={() => setOpen(false)}
// 			/>
// 		);
// 	if (tableType == "TableBonusPosition")
// 		return (
// 			<BonusPositionBatchCreateForm
// 				bonusType={bonusType}
// 				formSchema={z.object({ content: z.array(schema) })}
// 				mode={mode}
// 				closeSheet={() => setOpen(false)}
// 			/>
// 		);
// if (tableType == "TableBonusPositionType") return <BonusPositionTypeBatchCreateForm
// 		bonusType={bonusType}
// 		formSchema={z.object({ content: z.array(schema) })}
// 		mode={mode}
// 	c	loseSheet={() => setOpen(false)}
// />;
// 	if (tableType == "TableBonusSeniority")
// 		return (
// 			<BonusSeniorityBatchCreateForm
// 				bonusType={bonusType}
// 				formSchema={z.object({ content: z.array(schema) })}
// 				mode={mode}
// 				closeSheet={() => setOpen(false)}
// 			/>
// 		);
// }
