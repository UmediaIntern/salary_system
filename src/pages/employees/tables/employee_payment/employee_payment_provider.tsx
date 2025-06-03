import { type PropsWithChildren, useContext } from "react";
import {
	createTableFunctionContext,
	useTableFunctionState,
} from "~/components/table_functions/context/table_functions_context";
import { type FunctionsItem } from "~/components/table_functions/table_functions_types";
import { type EmployeePaymentFEType } from "~/server/api/types/employee_payment_type";

export type PaymentRowItem = Omit<
	EmployeePaymentFEType,
	"start_date" | "end_date" | "long_service_allowance_type"
> & {
	long_service_allowance_type: string;
	start_date: Date | null;
	end_date: Date | null;
	functions: FunctionsItem;
};
export type PaymentRowItemKey = keyof PaymentRowItem;
export type PaymentFunctionModes =
	| "create"
	| "update"
	| "delete"
	| "excel_download"
	| "excel_upload"
	// | "initialize"
	| "auto_calculate"
	| "adjust_base_salary"
	| "none";

const employeePaymentFunctionContext = createTableFunctionContext<
	PaymentFunctionModes,
	PaymentRowItem
>();

export function EmployeePaymentFunctionContextProvider({
	children,
}: PropsWithChildren) {
	const {
		openSheet,
		setOpenSheet,
		openDialog,
		setOpenDialog,
		mode,
		setMode,
		data,
		setData,
	} = useTableFunctionState<PaymentFunctionModes, PaymentRowItem>("none");

	return (
		<employeePaymentFunctionContext.Provider
			value={{
				openSheet,
				setOpenSheet,
				openDialog,
				setOpenDialog,
				mode,
				setMode,
				data,
				setData,
			}}
		>
			{children}
		</employeePaymentFunctionContext.Provider>
	);
}

export function usePaymentFunctionContext() {
	const context = useContext(employeePaymentFunctionContext);
	if (context === null) {
		throw new Error(
			"usePaymentFunctionContext must be used within a EmployeePaymentFunctionContextProvider"
		);
	}
	return context;
}
