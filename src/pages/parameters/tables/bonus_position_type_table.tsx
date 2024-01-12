import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { c_CreateDateStr, c_EndDateStr, c_StartDateStr } from "../constant";
import { BonusPositionType } from "~/server/database/entity/SALARY/bonus_position_type";
import { LoadingSpinner } from "~/components/loading";
import { TABLE_BONUS_POSITION_TYPE } from "~/pages/table_names";

export type RowItem = {
	position_type: string;
	multiplier: number;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

const columns = [
	columnHelper.accessor("position_type", {
		header: ({ column }) => {
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
							Position Type
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="capitalize">
				{row.getValue("position_type")}
			</div>
		),
	}),
	columnHelper.accessor("multiplier", {
		header: () => <div className="text-center">Multiplier</div>,
		cell: ({ row }) => {
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{`${row.original.multiplier}`}</div>
				</div>
			);
		},
	}),
];

function bonusPositionTypeMapper(
	bonusPositionTypeData: BonusPositionType[]
): RowItem[] {
	return bonusPositionTypeData.map((d) => {
		return {
			position_type: d.position_type,
			multiplier: d.multiplier,
		};
	});
}

export function BonusPositionTypeTable({ index, globalFilter, viewOnly }: any) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentBonusPositionType.useQuery();
	const filterKey: RowItemKey = "position_type";

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
					columns={columns}
					data={bonusPositionTypeMapper(data)}
					filterColumnKey={filterKey}
					table_name={TABLE_BONUS_POSITION_TYPE}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={columns}
					data={bonusPositionTypeMapper(data)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);

	// useMemo(() => {
	// 	table.getColumn(filter_key)?.setFilterValue(globalFilter);
	// }, [globalFilter]);
}
