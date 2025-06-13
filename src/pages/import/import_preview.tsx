import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
	type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	CircleCheck,
	EllipsisVertical,
	GripVertical,
	Loader,
} from "lucide-react";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	Row,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { useImportContext } from "./import_context_provider";
import { useEffect, useId, useMemo, useState } from "react";
import {
	importFields,
	ImportFieldsKeyType,
} from "~/server/api/types/import_type";
import { DataTableViewOptions } from "~/components/data_table/toolbar/data_table_view_options";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { DataTablePagination } from "~/components/data_table/data_table_pagination";
import { createColumnHelper } from "@tanstack/react-table";
import { I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";

const schema = importFields;

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
	const { attributes, listeners } = useSortable({
		id,
	});

	return (
		<Button
			{...attributes}
			{...listeners}
			variant="ghost"
			size="icon"
			className="size-7 text-muted-foreground hover:bg-transparent"
		>
			<GripVertical className="size-3 text-muted-foreground" />
			<span className="sr-only">Drag to reorder</span>
		</Button>
	);
}

const numberColumns: (t: I18nType) => ColumnDef<z.infer<typeof schema>>[] = (
	t: I18nType
) => {
	const f: ImportFieldsKeyType[] = [
		"position",
		"dependents",
		"healthcare_dependents",
		"seniority",
		"annual_days_in_service",
		"l_i",
		"h_i",
		"l_r",
	];

	return f.map((key: ImportFieldsKeyType) => {
		return {
			id: key,
			header: () => <div className="w-full text-right">{key}</div>,
			cell: ({ row }) => (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						toast.promise(
							new Promise((resolve) => setTimeout(resolve, 1000)),
							{
								loading: `Saving ${row.original.emp_no}`,
								success: "Done",
								error: "Error",
							}
						);
					}}
				>
					<Label
						htmlFor={`${row.original.emp_no}-target`}
						className="sr-only"
					>
						{key}
					</Label>
					<Input
						className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
						defaultValue={row.original[key]?.toString()}
						id={`${row.original.emp_no}-target`}
					/>
				</form>
			),
		};
	});
};

// const columnHelper = createColumnHelper<z.infer<typeof schema>>();

const columnsCreater: (t: I18nType) => ColumnDef<z.infer<typeof schema>>[] = (
	t: I18nType
) => [
	{
		id: "drag",
		header: () => null,
		cell: ({ row }) => <DragHandle id={row.original.emp_no} />,
	},
	{
		id: "select",
		header: ({ table }) => (
			<div className="flex items-center justify-center">
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) =>
						table.toggleAllPageRowsSelected(!!value)
					}
					aria-label="Select all"
				/>
			</div>
		),
		cell: ({ row }) => (
			<div className="flex items-center justify-center">
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "work_type",
		header: "work_type",
		cell: ({ row }) => (
			<div className="w-32">
				<Badge
					variant="outline"
					className="px-1.5 text-muted-foreground"
				>
					{row.original.work_type}
				</Badge>
			</div>
		),
	},
	{
		accessorKey: "work_status",
		header: "work_status",
		cell: ({ row }) => (
			<Badge variant="outline" className="px-1.5 text-muted-foreground">
				{row.original.work_status === "NewEmployee" ? (
					<CircleCheck className="fill-green-500 dark:fill-green-400" />
				) : (
					<Loader />
				)}
				{row.original.work_status}
			</Badge>
		),
	},
	...numberColumns(t),
	{
		id: "actions",
		cell: () => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="flex size-4 text-muted-foreground data-[state=open]:bg-muted"
						size="icon"
					>
						<EllipsisVertical />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-32">
					<DropdownMenuItem>Edit</DropdownMenuItem>
					<DropdownMenuItem>Make a copy</DropdownMenuItem>
					<DropdownMenuItem>Favorite</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
	const { transform, transition, setNodeRef, isDragging } = useSortable({
		id: row.original.emp_no,
	});

	return (
		<TableRow
			data-state={row.getIsSelected() && "selected"}
			data-dragging={isDragging}
			ref={setNodeRef}
			className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
			style={{
				transform: CSS.Transform.toString(transform),
				transition: transition,
			}}
		>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id} className="h-8 p-1">
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	);
}

export function ImportPreview() {
	const { excelData, setExcelData } = useImportContext();
	const { t } = useTranslation(["common"]);

	const [data, setData] = useState(excelData);
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const sortableId = useId();
	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {})
	);

	useEffect(() => {
		setData(excelData);
	}, [excelData]);

	const dataIds = useMemo<UniqueIdentifier[]>(
		() => data?.map(({ emp_no }) => emp_no) || [],
		[data]
	);

	const columns = columnsCreater(t);
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
		},
		getRowId: (row) => row.emp_no.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			setData((data) => {
				const oldIndex = dataIds.indexOf(active.id);
				const newIndex = dataIds.indexOf(over.id);
				return arrayMove(data, oldIndex, newIndex);
			});
		}
	}

	return (
		<div className="flex h-full w-full flex-col bg-blue-100 px-1">
			<div className="flex items-center justify-end px-4 py-1 lg:px-6">
				<DataTableViewOptions table={table} />
			</div>
			<div className="h-0 w-full flex-grow overflow-y-scroll rounded-lg border bg-red-50">
				<DndContext
					collisionDetection={closestCenter}
					modifiers={[restrictToVerticalAxis]}
					onDragEnd={handleDragEnd}
					sensors={sensors}
					id={sortableId}
				>
					<Table>
						<TableHeader className="sticky top-0 z-10 w-full bg-muted p-1">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow
									key={headerGroup.id}
									className="w-full"
								>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead
												key={header.id}
												colSpan={header.colSpan}
												className="h-10"
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column
																.columnDef
																.header,
															header.getContext()
													  )}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody className="**:data-[slot=table-cell]:first:w-8">
							{table.getRowModel().rows?.length ? (
								<SortableContext
									items={dataIds}
									strategy={verticalListSortingStrategy}
								>
									{table.getRowModel().rows.map((row) => (
										<DraggableRow key={row.id} row={row} />
									))}
								</SortableContext>
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</DndContext>
			</div>
			<DataTablePagination table={table} className="py-1" />
		</div>
	);
}
