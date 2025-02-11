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

export function EmployeeTrustFunctionMenu() {
	const { setMode } = useTrustFunctionContext();

	return (
		<FunctionMenu>
			<FunctionMenuOption.ExcelDownload
				onClick={() => setMode("excel_download")}
			/>
			<FunctionMenuOption.ExcelUpload
				onClick={() => setMode("excel_upload")}
			/>
			<FunctionMenuOption.Initialize
				onClick={() => setMode("initialize")}
			/>
		</FunctionMenu>
	);
}

export function EmployeeTrustFunctions() {
	const { data, open, setOpen, mode } = useTrustFunctionContext();

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

	return (
		<>
			<ConfirmDialog
				open={open && mode === "delete"}
				onOpenChange={setOpen}
				onClick={() =>
					data && deleteEmployeeTrust.mutate({ id: data.id })
				}
				data={
					employeeTrustSchema
						.merge(z.object({ end_date: zodOptionalDate() }))
						.safeParse(data).data
				}
			/>
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
		</>
	);
}
