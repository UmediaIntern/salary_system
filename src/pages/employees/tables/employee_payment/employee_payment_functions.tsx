import { api } from "~/utils/api";
import { FunctionMenu } from "~/components/table_functions/function_menu/function_menu";
import { usePaymentFunctionContext } from "./employee_payment_provider";
import { FunctionMenuOption } from "~/components/table_functions/function_menu/function_menu_option";
import { employeePaymentSchema } from "../../schemas/configurations/employee_payment_schema";
import { z } from "zod";
import { ConfirmDialog } from "~/components/table_functions/confirm_dialog";
import { TableFunctionSheet } from "~/components/table_functions/function_sheet/function_sheet";
import {
	buildStandardFormProps,
	StandardForm,
} from "~/components/form/default/form_standard";
import { zodOptionalDate } from "~/lib/utils/zod_types";
import { DateDialog } from "../../components/function_sheet/date_dialog";
import { AdjustBaseSalaryDialog } from "../../components/function_sheet/adjust_base_salary_dialog";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { ExcelDownload } from "~/components/file_operations/excel_download";
import { ExcelUpload } from "~/components/file_operations/excel_upload";
import { useEmployeeTableContext } from "../../components/context/data_table_context_provider";
import { getExcelData } from "~/components/file_operations/excel_utils";
import { useAccessContext } from "~/components/context/access_context_provider";

export function EmployeePaymentFunctionMenu() {
	const { setMode, setOpenDialog } = usePaymentFunctionContext();
	const { access } = useAccessContext();

	const enableAccess = access.employees_write;

	return (
		<FunctionMenu>
			<FunctionMenuOption.ExcelDownload
				disabled={!enableAccess}
				onClick={() => {
					setMode("excel_download");
					setOpenDialog(true);
				}}
			/>
			<FunctionMenuOption.ExcelUpload
				disabled={!enableAccess}
				onClick={() => {
					setMode("excel_upload");
					setOpenDialog(true);
				}}
			/>
			{/* <FunctionMenuOption.Initialize
				disabled={!enableAccess}
				onClick={() => setMode("initialize")}
			/> */}
			<FunctionMenuOption.AdjustLevel
				disabled={!enableAccess}
				onClick={() => {
					setMode("adjust_level");
					setOpenDialog(true);
				}}
			/>
			<FunctionMenuOption.AdjustBaseSalary
				disabled={!enableAccess}
				onClick={() => {
					setMode("adjust_base_salary");
					setOpenDialog(true);
				}}
			/>
		</FunctionMenu>
	);
}

export function EmployeePaymentFunctions() {
	const { data, openSheet, setOpenSheet, mode, openDialog, setOpenDialog } =
		usePaymentFunctionContext();

	const ctx = api.useUtils();
	const updateEmployeePayment =
		api.employeePayment.updateEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.invalidate();
			},
		});
	const createEmployeePayment =
		api.employeePayment.createEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.invalidate();
			},
		});
	const batchCreateEmployeePayment =
		api.employeePayment.batchCreateEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.invalidate();
			},
		});

	const deleteEmployeePayment =
		api.employeePayment.deleteEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.invalidate();
			},
		});
	const adjustLevelEmployeePayment =
		api.employeePayment.adjustLevelEmployeePayment.useMutation({
			onSuccess: () => {
				void ctx.employeePayment.invalidate();
			},
		});

	const createFormSchema = employeePaymentSchema.omit({ id: true });
	const createForm = buildStandardFormProps({
		formSchema: createFormSchema,
		formConfig: [{ key: "emp_no", config: { fixed: true } }],

		formSubmit: (d) => {
			createEmployeePayment.mutate(d);
			setOpenSheet(false);
		},
		buttonText: "create",
		defaultValue: data ? createFormSchema.safeParse(data).data : undefined,
		closeSheet: () => setOpenSheet(false),
	});

	const updateForm = buildStandardFormProps({
		formSchema: employeePaymentSchema,
		formConfig: [
			{ key: "id", config: { hidden: true } },
			{ key: "emp_no", config: { fixed: true } },
		],
		formSubmit: (d) => {
			updateEmployeePayment.mutate(d);
			setOpenSheet(false);
		},
		buttonText: "update",
		defaultValue: data
			? employeePaymentSchema.safeParse(data).data
			: undefined,
		closeSheet: () => setOpenSheet(false),
	});

	const { selectedTable } = useEmployeeTableContext();

	return (
		<>
			<TableFunctionSheet
				openSheet={openSheet && mode !== "delete"}
				setOpenSheet={setOpenSheet}
				mode={mode}
				tableType={"TableEmployeePayment"}
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
				{/* Delete */}
				{mode === "delete" && (
					<ConfirmDialog
						onClick={() =>
							data &&
							deleteEmployeePayment.mutate({ id: data.id })
						}
						data={
							employeePaymentSchema
								.merge(
									z.object({ end_date: zodOptionalDate() })
								)
								.safeParse(data).data
						}
					/>
				)}

				{/* Adjust Level */}
				{mode === "adjust_level" && (
					<DateDialog
						onSubmit={(date) => {
							adjustLevelEmployeePayment.mutate({
								start_date: date,
							});
							setOpenDialog(false);
						}}
					/>
				)}

				{/* Adjust base salary */}
				{mode === "adjust_base_salary" && <AdjustBaseSalaryDialog setOpenDialog={setOpenDialog}/>}
				{/* Download excel */}
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
						fileName="employee_payment"
						setOpenDialog={setOpenDialog}
					/>
				)}
				{mode === "excel_upload" && (
					<DialogContent className="flex h-[80vh] max-w-[80vw] flex-col p-8">
						<DialogHeader>
							<DialogTitle>Upload excel</DialogTitle>
							<DialogDescription>
								Upload employee payment excel
							</DialogDescription>
						</DialogHeader>
						{/* TODO: This is bad */}
						<ExcelUpload
							onClick={(data) => {
								batchCreateEmployeePayment.mutate(data);
								setOpenDialog(false);
							}}
						/>
					</DialogContent>
				)}
			</Dialog>
		</>
	);
}
