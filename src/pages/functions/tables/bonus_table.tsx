import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { PayTypeEnumType } from "~/server/api/types/pay_type_enum";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { NewBonusFEDiffType } from "~/server/api/types/bonus_type";
import { cn } from "~/lib/utils";

const columns = (t: I18nType, dataDiff: NewBonusFEDiffType[]) =>
	[
		"department",
		"emp_no",
		"emp_name",
		"position",
		"work_day",
		"project_bonus",
		"full_attendance_bonus",
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

interface BonusTableProps {
	period_id: number;
	emp_no_list: string[];
	pay_type: PayTypeEnumType;
}

export function BonusTable({ period_id, emp_no_list, pay_type }: BonusTableProps) {
	const { isLoading, isError, data, error } =
		api.function.getNewBonusFEByEmpNoList.useQuery({
			period_id: period_id,
			emp_no_list: emp_no_list,
			pay_type: pay_type,
		});

	const { isLoading: isLoadingDiff, isError: isErrorDiff, data: dataDiff, error: errorDiff } =
		api.function.getNewBonusFEDiffByEmpNoList.useQuery({
			cur_period_id: period_id,
			emp_no_list: emp_no_list,
			pay_type: pay_type,
		});

	const { t } = useTranslation(["common"]);

	if (isLoading || isLoadingDiff) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError || isErrorDiff) {
		return <span>Error: {error?.message ?? ""}, Diff Error: {errorDiff?.message ?? ""}</span>; // TODO: Error element with toast
	}

	if (data && dataDiff) {
		const filteredData = data.filter((d: any) =>
			["project_bonus",
				"full_attendance_bonus"]
				.some(key => d[key] > 0)
		);
		return <DataTable columns={columns(t, dataDiff)} data={filteredData} />;
	}
	return <div />;
}
