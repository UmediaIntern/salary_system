import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
	isString,
	isNumber,
	isDate,
} from "~/pages/develop_parameters/utils/checkType";
import { DataTable } from "../components/data_table";
import { AttendanceSetting } from "~/server/database/entity/attendance_setting";
import {
	c_CreateDateStr,
	c_EndDateStr,
	c_StartDateStr,
} from "../constant";
import { BonusDepartment } from "~/server/database/entity/bonus_department";
import { BonusPosition } from "~/server/database/entity/bonus_position";

export type RowItem = {
	position: number;
	multiplier: number;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

const columns = [
	columnHelper.accessor("position", {
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Position
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="pl-4 w-[400px] lowercase">{row.getValue("position")}</div>
		),
	}),
	columnHelper.accessor("multiplier", {
		header: () => <div className="text-center">Multiplier</div>,
		cell: ({ row }) => {
			return <div className="flex justify-center"><div className="w-80 text-center font-medium">{`${row.original.multiplier}`}</div></div>;
		},
	}),
];

function bonusPositionMapper(bonusPositionData: BonusPosition[]): RowItem[] {
	return bonusPositionData.map((d) => {
		return {
			position: d.position,
			multiplier: d.multiplier,
		}})
}

export function BonusPositionTable({ index, globalFilter }: any) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentBonusPosition.useQuery();
	const filterKey: RowItemKey = "position";

	if (isLoading) {
		return <span>Loading</span>; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<>
			<AccordionItem value={"item-" + index.toString()}>
				<AccordionTrigger>{"獎金職等"}</AccordionTrigger>
				<AccordionContent>
					<DataTable
						columns={columns}
						data={bonusPositionMapper(data)}
						filterColumnKey={filterKey}
					/>
				</AccordionContent>
			</AccordionItem>
		</>
	);

	// useMemo(() => {
	// 	table.getColumn(filter_key)?.setFilterValue(globalFilter);
	// }, [globalFilter]);
}
