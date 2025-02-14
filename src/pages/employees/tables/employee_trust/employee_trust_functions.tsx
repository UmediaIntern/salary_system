import { useTrustFunctionContext } from "./employee_trust_provider";
import { FunctionMenu } from "~/components/table_functions/function_menu/function_menu";
import { FunctionMenuOption } from "~/components/table_functions/function_menu/function_menu_option";
import { ConfirmDialog } from "~/components/table_functions/confirm_dialog";
import { employeeTrustSchema } from "../../schemas/configurations/employee_trust_schema";
import { z } from "zod";
import { zodOptionalDate } from "~/lib/utils/zod_types";
import { TableFunctionSheet } from "~/components/table_functions/function_sheet/function_sheet";
import {
	buildStandardFormProps,
	StandardForm,
} from "~/components/form/default/form_standard";
import { api } from "~/utils/api";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { ExcelDownload } from "~/components/file_operations/excel_download";
import { ExcelUpload } from "~/components/file_operations/excel_upload";
import { getExcelData } from "../../components/excel_download/utils";
import { useEmployeeTableContext } from "../../components/context/data_table_context_provider";

export function EmployeeTrustFunctionMenu() {
	const { setMode, setOpenDialog } = useTrustFunctionContext();

	return (
		<FunctionMenu>
			<FunctionMenuOption.ExcelDownload
				onClick={() => {
					setMode("excel_download");
					setOpenDialog(true);
				}}
			/>
			<FunctionMenuOption.ExcelUpload
				onClick={() => {
					setMode("excel_upload");
					setOpenDialog(true);
				}}
			/>
			<FunctionMenuOption.Initialize
				onClick={() => setMode("initialize")}
			/>
		</FunctionMenu>
	);
}

export function EmployeeTrustFunctions() {
	const { data, open, setOpen, mode, openDialog, setOpenDialog } =
		useTrustFunctionContext();

	const ctx = api.useUtils();
	const deleteEmployeeTrust =
		api.employeeTrust.deleteEmployeeTrust.useMutation({
			onSuccess: () => {
				void ctx.employeeTrust.invalidate();
			},
		});
	const updateEmployeeTrust =
		api.employeeTrust.updateEmployeeTrust.useMutation({
			onSuccess: () => {
				void ctx.employeeTrust.invalidate();
			},
		});
	const createEmployeeTrust =
		api.employeeTrust.createEmployeeTrust.useMutation({
			onSuccess: () => {
				void ctx.employeeTrust.invalidate();
			},
		});

	const createFormSchema = employeeTrustSchema.omit({ id: true });
	const createForm = buildStandardFormProps({
		formSchema: createFormSchema,
		formSubmit: (d) => {
			createEmployeeTrust.mutate(d);
			setOpen(false);
		},
		buttonText: "create",
		defaultValue: data ? createFormSchema.safeParse(data).data : undefined, // TODO: move this into buildStandardFormProps function
		closeSheet: () => setOpen(false),
	});

	const updateForm = buildStandardFormProps({
		formSchema: employeeTrustSchema,
		formConfig: [{ key: "id", config: { hidden: true } }],
		formSubmit: (d) => {
			updateEmployeeTrust.mutate(d);
			setOpen(false);
		},
		buttonText: "update",
		defaultValue: data
			? employeeTrustSchema.safeParse(data).data
			: undefined,
		closeSheet: () => setOpen(false),
	});

	const { selectedTable } = useEmployeeTableContext();

	return (
		<>
			<TableFunctionSheet
				openSheet={open && mode !== "delete"}
				setOpenSheet={setOpen}
				mode={mode}
				tableType={"TableEmployeeTrust"}
			>
				{mode === "create" ? (
					<StandardForm {...createForm} />
				) : (
					<StandardForm {...updateForm} />
				)}
			</TableFunctionSheet>
			<Dialog
				open={openDialog}
				onOpenChange={setOpenDialog}
				aria-hidden={false}
			>
				{mode === "delete" && (
					<ConfirmDialog
						onClick={() =>
							data && deleteEmployeeTrust.mutate({ id: data.id })
						}
						data={
							employeeTrustSchema
								.merge(
									z.object({ end_date: zodOptionalDate() })
								)
								.safeParse(data).data
						}
					/>
				)}
				{/* Download excel */}
				{/* Fix type later */}
				{mode === "excel_download" && (
					<ExcelDownload
						data={getExcelData(
							selectedTable?.table
								.getFilteredRowModel()
								.rows.map(
									(r) => r.original as Record<string, unknown>
								) ?? [],
							["id", "functions", "disabled"]
						)}
						fileName="employee_trust"
					/>
				)}
				{mode === "excel_upload" && (
					<DialogContent className="flex max-h-[80vh] max-w-[80vw] p-8">
						<ExcelUpload />
					</DialogContent>
				)}
			</Dialog>
		</>
	);
}
