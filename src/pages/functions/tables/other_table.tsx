import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { ExpenseWithType } from "~/server/service/ehr_service";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";

/*
	emp_no: z.string(),
	emp_name: z.string(),
	department: z.string(),
	position: z.number(),
	other_addition: z.number(),
	other_addition_tax: z.number(),
	other_deduction: z.number(),
	other_deduction_tax: z.number(),
	dorm_deduction: z.number(),
	g_i_deduction_promotion: z.number(),
	g_i_deduction_family: z.number(),
	income_tax_deduction: z.number(),
	l_r_self: z.number(),
	parking_fee: z.number(),
	brokerage_fee: z.number(),
	retirement_income: z.number(),
	l_i_disability_reduction: z.number(),
	h_i_subsidy: z.number(),	

*/

const columns = (t: I18nType) =>
	[
		// "period_name",
		// "emp_no",
		// "emp_name",
		// "kind",
		// "id",
		// "expense_type_name",
		// "amount",
		// "remark",
		// "pay_delay"

		"department",
		"emp_no",
		"emp_name",
		"position",
		"work_day",

		"reissue_salary",
		"retirement_income",
		"other_addition",
		"other_addition_tax",

		"dorm_deduction",
		"g_i_deduction_promotion",
		"income_tax_deduction",
		"l_r_self",
		"parking_fee",
		"brokerage_fee",
		"other_deduction",
		"other_deduction_tax",

		"g_i_deduction_family",
		"l_i_disability_reduction",
		"h_i_subsidy",
	].map((key) => {
		return {
			accessorKey: key,
			header: ({ column }: any) => {
				const { t } = useTranslation(["common"]);
				return (
					<div className="flex justify-center">
						<div className="text-center font-medium">
							<Button
								variant="ghost"
								onClick={() =>
									column.toggleSorting(
										column.getIsSorted() === "asc"
									)
								}
							>
								{t(`table.${key}`)}
								<ArrowUpDown className="ml-2 h-4 w-4" />
							</Button>
						</div>
					</div>
				);
			},
		};
	});

interface OtherTableProps {
	period_id: number;
	emp_no_list: string[];
}

export function OtherTable({ period_id, emp_no_list }: OtherTableProps) {
	const { isLoading, isError, data, error } =
		api.function.getNewOtherFEByEmpNoList.useQuery({
			period_id: period_id,
			emp_no_list: emp_no_list,
		});

	const details =
		api.function.getOtherDetailsByEmpNoList.useQuery({
			period_id: period_id,
			emp_no_list: emp_no_list,
		});

	const { t } = useTranslation(["common"]);

	if (isLoading || details.isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	// if (details.isFetched) {
	// 	return <Button onClick={() => console.log(details.data)}>test</Button>
	// }	

	if (data) {
		const filteredData = data.filter((d: any) =>
			["reissue_salary",
				"retirement_income",
				"other_addition",
				"other_addition_tax",
				"dorm_deduction",
				"g_i_deduction_promotion",
				"income_tax_deduction",
				"l_r_self",
				"parking_fee",
				"brokerage_fee",
				"other_deduction",
				"other_deduction_tax",
				"g_i_deduction_family",
				"l_i_disability_reduction",
				"h_i_subsidy",]
				.some(key => d[key] > 0)
		);

		return <DataTable columns={columns(t)} data={filteredData} detailData={
			details.data!.map((emp_data: any) => {
				return {
					"other_addition": emp_data.other_addition.map((expense: ExpenseWithType) => {
						return {
							emp_no: emp_data.emp_no,
							emp_name: expense.emp_name,
							expense_type_name: expense.expense_type_name,
							amount: expense.amount
						}
					}),
					"other_addition_tax": emp_data.other_addition_tax.map((expense: ExpenseWithType) => {
						return {
							emp_no: emp_data.emp_no,
							emp_name: expense.emp_name,
							expense_type_name: expense.expense_type_name,
							amount: expense.amount
						}
					}),
					"other_deduction": emp_data.other_deduction.map((expense: ExpenseWithType) => {
						return {
							emp_no: emp_data.emp_no,
							emp_name: expense.emp_name,
							expense_type_name: expense.expense_type_name,
							amount: expense.amount
						}
					}),
					"other_deduction_tax": emp_data.other_deduction_tax.map((expense: ExpenseWithType) => {
						return {
							emp_no: emp_data.emp_no,
							emp_name: expense.emp_name,
							expense_type_name: expense.expense_type_name,
							amount: expense.amount
						}
					}),
				}
			})
		} />;
	}
	return <div />;
}
