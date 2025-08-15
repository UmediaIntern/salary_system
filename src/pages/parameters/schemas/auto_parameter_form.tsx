import { type z } from "zod";
import { attendanceSchema } from "./configurations/attendance_schema";
import { bankSchema } from "./configurations/bank_schema";
import { insuranceSchema } from "./configurations/insurance_schema";
import { levelSchema } from "./configurations/level_schema";
import { levelRangeSchema } from "./configurations/level_range_schema";
import { trustMoneySchema } from "./configurations/trust_money_schema";
import { salaryIncomeTaxSchema } from "./configurations/salary_income_tax_schema";
import { incomeTaxSchema } from "./configurations/income_tax_schema";
import { allowanceRangeSchema } from "./configurations/allowance_range_schema";
import {
	FormSchemaConfig,
	ParameterForm,
} from "../components/function_sheet/parameter_form";
import { SelectLevelField } from "../components/function_sheet/form_fields/select_level_field";
import { useDataTableContext } from "../components/context/data_table_context_provider";
import { FunctionModeEnumType } from "../components/context/data_table_context";

function DefaultModeAndCloseForm<SchemaType extends z.AnyZodObject>({
	mode,
	formSchema,
	formConfig,
}: FormSchemaConfig<SchemaType>) {
	const { setOpenSheet, setOpenDialog } = useDataTableContext();

	return (
		<ParameterForm
			formSchema={formSchema}
			formConfig={formConfig}
			mode={mode}
			closeSheet={() => {
				setOpenSheet(false);
				setOpenDialog(false);
			}}
		/>
	);
}

export function AutoParameterForm({ mode }: { mode: FunctionModeEnumType }) {
	const { selectedTableType } = useDataTableContext();
	switch (selectedTableType) {
		case "TableAttendance":
			return (
				<DefaultModeAndCloseForm
					mode={mode}
					formSchema={attendanceSchema}
					formConfig={[{ key: "id", config: { hidden: true } }]}
				/>
			);
		case "TableBankSetting":
			return (
				<DefaultModeAndCloseForm
					mode={mode}
					formSchema={bankSchema}
					formConfig={[{ key: "id", config: { hidden: true } }]}
				/>
			);
		case "TableInsurance":
			return (
				<DefaultModeAndCloseForm
					mode={mode}
					formSchema={insuranceSchema}
					formConfig={[{ key: "id", config: { hidden: true } }]}
				/>
			);
		case "TableTrustMoney":
			return (
				<DefaultModeAndCloseForm
					mode={mode}
					formSchema={trustMoneySchema}
					formConfig={[{ key: "id", config: { hidden: true } }]}
				/>
			);
		case "TableLevel":
			return (
				<DefaultModeAndCloseForm
					mode={mode}
					formSchema={levelSchema}
					formConfig={[{ key: "id", config: { hidden: true } }]}
				/>
			);
		case "TableLevelRange":
			return (
				<DefaultModeAndCloseForm
					mode={mode}
					formSchema={levelRangeSchema}
					formConfig={[
						{ key: "id", config: { hidden: true } },
						{
							key: "level_start",
							config: {
								render: SelectLevelField,
							},
						},
						{
							key: "level_end",
							config: {
								render: SelectLevelField,
							},
						},
					]}
				/>
			);

		case "TableTrustMoney":
			return (
				<DefaultModeAndCloseForm
					mode={mode}
					formSchema={trustMoneySchema}
					formConfig={[{ key: "id", config: { hidden: true } }]}
				/>
			);
		case "TableSalaryIncomeTax":
			return (
				<DefaultModeAndCloseForm
					mode={mode}
					formSchema={salaryIncomeTaxSchema}
					formConfig={[{ key: "id", config: { hidden: true } }]}
				/>
			);
		case "TableIncomeTaxSetting":
			return (
				<DefaultModeAndCloseForm
					mode={mode}
					formSchema={incomeTaxSchema}
					formConfig={[{ key: "id", config: { hidden: true } }]}
				/>
			);
		case "TableAllowanceRange":
			return (
				<DefaultModeAndCloseForm
					mode={mode}
					formSchema={allowanceRangeSchema}
					formConfig={[{ key: "id", config: { hidden: true } }]}
				/>
			);
		default:
			throw Error("Table not found");
	}
}
