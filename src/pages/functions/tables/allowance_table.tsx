import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { NewAllowanceFEDiffType } from "~/server/api/types/allowance_type";
import { cn } from "~/lib/utils";

const columns = (t: I18nType, dataDiff: NewAllowanceFEDiffType[]) =>
	[
		// "period_name",
		"department",
		"emp_no",
		"emp_name",
		"position",
		"work_day",

		// "主管職務久任補助伙食輪班證照"
		"supervisor_allowance",
		"occupational_allowance",
		"long_service_allowance",
		"subsidy_allowance",
		"food_allowance",
		"shift_allowance",
		"professional_cert_allowance",

		// "amount",
		// "remark",
		// "pay_delay"
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
			cell: ({ row }: any) => {
				let diff = false;
				for (let [k, v] of Object.entries(dataDiff.find(e => e.emp_no == row.original.emp_no) ?? {})) {
					if (k == key) {
						diff = v == true;
					}
				}
				let content = row.original[key]?.toString() ?? "";
				return <div className={cn("text-center font-medium", diff && "text-red-500")}>{content}</div>;
			},
		};
	});

interface AllowanceTableProps {
	period_id: number;
	emp_no_list: string[];
}

export function AllowanceTable({ period_id, emp_no_list }: AllowanceTableProps) {
	const { isLoading, isError, data, error } =
		api.function.getNewAllowanceFEByEmpNoList.useQuery({
			period_id: period_id,
			emp_no_list: emp_no_list,
		});

	const { isLoading: isLoadingDiff, isError: isErrorDiff, data: dataDiff, error: errorDiff } =
		api.function.getNewAllowanceFEDiffByEmpNoList.useQuery({
			cur_period_id: period_id,
			emp_no_list: emp_no_list,
		});

	const { t } = useTranslation(["common"]);

	if (isLoading || isLoadingDiff) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError || isErrorDiff) {
		return <span>Data Error: {error?.message ?? ""}, Diff Error: {errorDiff?.message ?? ""}</span>; // TODO: Error element with toast
	}

	if (data && dataDiff) {
		const filteredData = data.filter((d: any) =>
			["supervisor_allowance",
				"occupational_allowance",
				"subsidy_allowance",
				"shift_allowance",
				"professional_cert_allowance",
				"long_service_allowance"]
				.some(key => d[key] > 0)
			|| d.food_allowance !== 2400
		);
		return <DataTable columns={columns(t, dataDiff)} data={filteredData} />;
	}
	return <div />;
}
