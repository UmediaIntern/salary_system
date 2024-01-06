import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
	isString,
	isNumber,
	isDate,
} from "~/pages/develop_parameters/utils/checkType";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from "~/components/ui/dialog";
import { DataTable } from "../components/data_table";
import { c_CreateDateStr, c_EndDateStr, c_StartDateStr } from "../constant";
import { useRef, useState } from "react";
import { z } from "zod";
import { Label } from "~/components/ui/label";
import { DropdownCopyAction } from "../components/dropdown_copy_action";
import { AttendanceSetting } from "~/server/database/entity/SALARY/attendance_setting";
import { LoadingSpinner } from "~/components/loading";
import { TABLE_ATTENDANCE } from "~/pages/table_names";

const rowSchema = z.object({
	name: z.string(),
	value: z.union([z.number(), z.string(), z.date()]),
});
type RowItem = z.infer<typeof rowSchema>;

type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

const columns = [
	columnHelper.accessor("name", {
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
							Parameter
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="flex justify-center">
				<div className="text-center font-medium">
					{row.getValue("name")}
				</div>
			</div>
		),
	}),
	columnHelper.accessor("value", {
		header: () => <div className="text-center">Value</div>,
		cell: ({ row }) => {
			const value = row.getValue("value");
			let formatted = "";
			if (isNumber(value))
				formatted = parseFloat(row.getValue("value")).toString();
			else if (isString(value)) formatted = row.getValue("value");
			else if (isDate(value)) {
				if (value) {
					formatted =
						(value as Date).toISOString().split("T")[0] ?? "";
				} else formatted = "";
			}
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{formatted}</div>
				</div>
			);
		},
	}),
	columnHelper.display({
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			return <CompDropdown row={row.original} />;
		},
	}),
];

function attendanceMapper(attendanceData: AttendanceSetting): RowItem[] {
	return [
		{
			name: "事假扣薪",
			value: attendanceData.personal_leave_dock,
		},
		{
			name: "病假扣薪",
			value: attendanceData.sick_leave_dock,
		},
		{
			name: "不休假代金比率",
			value: attendanceData.rate_of_unpaid_leave,
		},
		{
			name: "不休假-補休1",
			value: attendanceData.unpaid_leave_compensatory_1,
		},
		{
			name: "不休假-補休2",
			value: attendanceData.unpaid_leave_compensatory_2,
		},
		{
			name: "不休假-補休3",
			value: attendanceData.unpaid_leave_compensatory_3,
		},
		{
			name: "不休假-補休4",
			value: attendanceData.unpaid_leave_compensatory_4,
		},
		{
			name: "不休假-補休5",
			value: attendanceData.unpaid_leave_compensatory_5,
		},
		{
			name: "本勞加班1",
			value: attendanceData.overtime_by_local_workers_1,
		},
		{
			name: "本勞加班2",
			value: attendanceData.overtime_by_local_workers_2,
		},
		{
			name: "本勞加班3",
			value: attendanceData.overtime_by_local_workers_3,
		},
		{
			name: "本勞假日",
			value: attendanceData.local_worker_holiday,
		},
		{
			name: "外勞加班1",
			value: attendanceData.overtime_by_foreign_workers_1,
		},
		{
			name: "外勞加班2",
			value: attendanceData.overtime_by_foreign_workers_2,
		},
		{
			name: "外勞加班3",
			value: attendanceData.overtime_by_foreign_workers_3,
		},
		{
			name: "外勞假日",
			value: attendanceData.foreign_worker_holiday,
		},
		{
			name: c_StartDateStr,
			value: new Date(attendanceData.start_date),
		},
		{
			name: c_EndDateStr,
			value: attendanceData.end_date
				? new Date(attendanceData.end_date)
				: new Date(),
		},
		{
			name: c_CreateDateStr,
			value: attendanceData.create_date,
		},
	];
}

export function AttendanceTable({ index, globalFilter }: any) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentAttendanceSetting.useQuery();
	const filterKey: RowItemKey = "name";

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
		<DataTable
			columns={columns}
			data={attendanceMapper(data)}
			filterColumnKey={filterKey}
			table_name={TABLE_ATTENDANCE}
		/>
	);
}

function CompDropdown({ row }: { row: RowItem }) {
	const [showDialog, setShowDialog] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />

					<DropdownCopyAction value={row.value.toString()} />
					<DropdownMenuItem
						onClick={() => {
							setShowDialog(true);
						}}
					>
						Update
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<CreateDialog
				row={row}
				showDialog={showDialog}
				onOpenChange={(open: boolean) => {
					setShowDialog(open);
				}}
				updateFunction={() => {}}
			/>
		</>
	);
}

function CreateDialog({
	row,
	showDialog,
	onOpenChange,
	schema,
	updateFunction,
}: {
	row: RowItem;
	showDialog: boolean;
	onOpenChange: (open: boolean) => void;
	schema?: any;
	updateFunction: (d: any) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);

	if (!schema)
		schema = isDate(row.value)
			? z.date()
			: isString(row.value)
			? z.string().max(10)
			: z.number().min(0);
	const [isValid, setIsValid] = useState(schema.safeParse(row.value).success);
	const updateIsValid = (x: string | number | Date) => {
		setIsValid(schema.safeParse(x).success);
	};
	return (
		<Dialog open={showDialog} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create the value</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="value" className="text-right">
							{row.name}
						</Label>
						{isNumber(row.value) ? (
							<Input
								ref={inputRef}
								id="value"
								defaultValue={row.value.toString()}
								type="number"
								className="col-span-3"
								onChange={() =>
									updateIsValid(
										parseFloat(
											inputRef.current?.value ?? "0"
										)
									)
								}
							/>
						) : isString(row.value) ? (
							<Input
								ref={inputRef}
								id="value"
								defaultValue={row.value as string}
								type={"value"}
								className="col-span-3"
								onChange={() => {
									updateIsValid(
										inputRef.current?.value ?? ""
									);
								}}
							/>
						) : (
							<Input
								ref={inputRef}
								id="value"
								defaultValue={
									row.value
										? (row.value as Date)
												.toISOString()
												.split("T")[0]
										: ""
								}
								type={"date"}
								className="col-span-3"
							/>
						)}
					</div>

					{!isValid && (
						<Label
							htmlFor="value"
							className="text-justify; text-red-500"
						>
							The input value is invalid
						</Label>
					)}
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							disabled={!isValid}
							type="submit"
							onClick={() => {}}
						>
							Save changes
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
