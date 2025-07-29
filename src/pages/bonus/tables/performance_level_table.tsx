import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { type PerformanceLevel } from "~/server/database/entity/SALARY/performance_level";
import { type TableComponentProps } from "../pre_calculate_bonus/bonus_filter";
import { useTranslation } from "react-i18next";

export type RowItem = {
	performance_level: string;
	multiplier: number;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const performance_level_columns = [
	columnHelper.accessor("performance_level", {
		header: ({ column }) => {
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
							{t("table.performance_level")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="text-center font-medium">{`${row.original.performance_level}`}</div>
		),
	}),
	columnHelper.accessor("multiplier", {
		header: ({ column }) => {
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
							{t("table.multiplier")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="text-center font-medium">{`${row.original.multiplier}`}</div>
		),
	}),
];

export function performaceLevelMapper(
	performanceLevelData: PerformanceLevel[]
): RowItem[] {
	return performanceLevelData.map((d) => {
		return {
			performance_level: d.performance_level,
			multiplier: d.multiplier,
		};
	});
}

interface PerformanceLevelTableProps extends TableComponentProps {
	periodId: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function PerformanceLevelTable({
	viewOnly,
}: PerformanceLevelTableProps) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentPerformanceLevel.useQuery();
	const filterKey: RowItemKey = "performance_level";

	if (isLoading) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<>
			{!viewOnly ? (
				<DataTableWithFunctions
					columns={performance_level_columns}
					data={performaceLevelMapper(data!)}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={performance_level_columns}
					data={performaceLevelMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
