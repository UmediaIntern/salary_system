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
import { CalculateBudgetDialog } from "./calculate_budget_dialog";
import { api } from "~/utils/api";
import { usePeriodContext } from "~/components/context/period_context_provider";

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
	const { selectedPeriod } = usePeriodContext()

	const ctx = api.useUtils();
	const calculateBudgetEmployeeBonus =
		api.bonus.calculateBudgetEmployeeBonus.useMutation({
			onSuccess: () => {
				void ctx.bonus.invalidate()
			}
		})

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
						<FunctionMenuOption.CalculateBudget
							onClick={() => {
								setMode("calculate_budget");
								setOpen(true);
							}}
						/>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* Sheet */}
				{mode == "excel_download" && (
					<BonusExcelDownloader
						table_name={tableType}
						bonus_type={bonusType}
						setOpenDialog={setOpen}
					/>
				)}
				{mode == "excel_upload" && (
					<BonusExcelUpload
						tableType={tableType}
						closeDialog={() => setOpen(false)}
					/>
				)}

				{mode == "calculate_budget" && (
					<CalculateBudgetDialog
						onSubmit={(budget) => {
							calculateBudgetEmployeeBonus.mutate({
								period_id: selectedPeriod!.period_id,
								bonus_type: bonusType,
								total_budgets: budget,
							})
							setOpen(false);
						}}
					/>
				)}

				{!["excel_download", "excel_upload", "calculate_budget"].includes(mode) && (
					<DialogContent className="w-[60%]">
						<DialogHeader>
							<DialogTitle>
								{`${t(`button.${mode}`)!}${t("button.form")} (${t(getTableNameKey(tableType))})`}
							</DialogTitle>
							<DialogDescription>
								{modeDescription(t, mode)}
							</DialogDescription>
						</DialogHeader>
						{["create", "update"].includes(mode) && (
							<ScrollArea className="h-full w-full">
								<BonusForm
									formSchema={mode === "create" ? baseSchema.omit({ id: true as const }) : schema}
									formConfig={mode === "update" ? [{ key: "id", config: { hidden: true } }] : undefined}
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
}
