import { cn } from "~/lib/utils";
import { useContext, useState } from "react";
import {
	type LucideIcon,
	NotebookPen,
	EllipsisVertical,
	Download,
	Upload,
	Calculator,
	CirclePlus,
} from "lucide-react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
	DropdownMenu,
	DropdownMenuItem,
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
	DialogTrigger,
} from "~/components/ui/dialog";

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { BonusForm } from "./bonus_form";
import { type TableEnum, getTableNameKey } from "../context/data_table_enum";
import { getSchema } from "../../schemas/get_schemas";
import { modeDescription } from "~/lib/utils/helper_function";
import { type BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { bonusToolbarFunctionsContext } from "./bonus_functions_context";
import { type FunctionMode } from "../context/data_table_context";
import { BonusExcelDownloader } from "../excel_download/bonus_excel_downloader";
import { BonusExcelUpload } from "../excel_upload/bonus_excel_upload";

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
	const functions = useContext(bonusToolbarFunctionsContext);
	const autoCalculateFunction = functions.autoCalculateFunction;
	const batchUpdateFunction = functions.batchUpdateFunction;

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
						<CompTriggerItem
							mode={"excel_download"}
							itemName={t("button.excel_download")}
							icon={Download}
						/>
						<CompTriggerItem
							mode={"excel_upload"}
							itemName={t("button.excel_upload")}
							icon={Upload}
						/>
						<CompTriggerItem
							mode={"create_with_blank"}
							itemName={t("button.create_with_blank")}
							icon={CirclePlus}
						/>
						{batchUpdateFunction && (
							<CompTriggerItem
								mode={"batch_update"}
								itemName={t("button.batch_update")}
								icon={NotebookPen}
							/>
						)}
						{autoCalculateFunction && (
							<CompTriggerItem
								mode={"auto_calculate"}
								itemName={t("button.auto_calculate")}
								icon={Calculator}
							/>
						)}
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
								<BonusForm
									formSchema={schema}
									formConfig={[
										{ key: "id", config: { hidden: true } },
									]}
									mode={mode}
									closeSheet={() => setOpen(false)}
								/>
								<ScrollBar orientation="horizontal" />
							</ScrollArea>
						)}
					</DialogContent>
				)}
			</Dialog>
		</div>
	);

	function CompTriggerItem(props: {
		mode: FunctionMode;
		itemName: string;
		icon: LucideIcon;
	}) {
		return (
			<DialogTrigger
				className="w-full"
				onClick={() => {
					setMode(props.mode);
					setOpen(true);
				}}
			>
				<DropdownMenuItem className="cursor-pointer">
					<props.icon className="mr-2 h-4 w-4" />
					<span>{props.itemName}</span>
				</DropdownMenuItem>
			</DialogTrigger>
		);
	}
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
