import React, { useContext, useEffect, useState } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { AttendanceTable } from "./tables/attendance_table";
import { BankTable } from "./tables/bank_table";
import { InsuranceRateTable } from "./tables/insurance_rate_table";
import { BonusTable } from "./tables/bonus_table";
import { BonusDepartmentTable } from "./tables/bonus_department_table";
import { BonusPositionTable } from "./tables/bonus_position_table";
import { BonusPositionTypeTable } from "./tables/bonus_position_type_table";
import { BonusSeniorityTable } from "./tables/bonus_seniority_table";
import { cn } from "~/lib/utils";
import {
	ActivitySquare,
	Briefcase,
	Cake,
	CircleDollarSign,
	Clock,
	CreditCard,
	Key,
	LucideIcon,
	Users,
} from "lucide-react";
import DataTableContextProvider from "./components/context/data_table_context_provider";
import dataTableContext from "./components/context/data_table_context";
import TableEnum, { getTableName } from "./components/context/data_table_enum";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";

type TableComponentProps = {
	index: number;
	globalFilter: string;
};

type TableComponent = {
	component: React.ReactElement<TableComponentProps>;
	icon: LucideIcon;
};

type ShowTableEnum = Extract<TableEnum, (typeof ShowTableEnumValues)[number]>;

const ShowTableEnumValues = [
	"TableAttendance",
	"TableBankSetting",
	"TableInsurance",
	"TableBonusSetting",
	"TableBonusDepartment",
	"TableBonusPosition",
	"TableBonusPositionType",
	"TableBonusSeniority",
] as const;

function getTableComponent(table: ShowTableEnum): TableComponent {
	switch (table) {
		case "TableAttendance":
			return {
				component: <AttendanceTable />,
				icon: Clock,
			};
		case "TableBankSetting":
			return {
				component: <BankTable />,
				icon: CreditCard,
			};
		case "TableInsurance":
			return {
				component: <InsuranceRateTable />,
				icon: ActivitySquare,
			};
		case "TableBonusSetting":
			return {
				component: <BonusTable />,
				icon: CircleDollarSign,
			};
		case "TableBonusDepartment":
			return {
				component: <BonusDepartmentTable />,
				icon: Users,
			};
		case "TableBonusPosition":
			return {
				component: <BonusPositionTable />,
				icon: Briefcase,
			};
		case "TableBonusPositionType":
			return {
				component: <BonusPositionTypeTable />,
				icon: Key,
			};
		case "TableBonusSeniority":
			return {
				component: <BonusSeniorityTable />,
				icon: Cake,
			};
		default:
			throw new Error(`Invalid table: ${table}`);
	}
}

export default function TablesView() {
	return (
		<DataTableContextProvider>
			<ResizablePanelGroup direction="horizontal">
				{/* left panel */}
				<ResizablePanel defaultSize={15} minSize={10}>
					<CompTablesSelector />
				</ResizablePanel>
				<ResizableHandle />
				{/* right panel */}
				<ResizablePanel minSize={40}>
					<CompTableView />
				</ResizablePanel>
			</ResizablePanelGroup>
		</DataTableContextProvider>
	);
}

function CompTablesSelector() {
	const [selectedTag, setSelectedTag] = useState<ShowTableEnum>(
		ShowTableEnumValues[0]
	);

	const { setSelectedTable } = useContext(dataTableContext);

	const tableComponentMap: Record<ShowTableEnum, TableComponent> =
		ShowTableEnumValues.reduce((map, table) => {
			map[table] = getTableComponent(table);
			return map;
		}, {} as Record<ShowTableEnum, TableComponent>);

	useEffect(() => {
		setSelectedTable(selectedTag);
	}, [selectedTag]);

	return (
		<>
			<div className="flex h-[48px] items-center justify-center text-lg">
				<div>Tables</div>
			</div>
			<Separator />
			<ScrollArea className="h-full">
				{ShowTableEnumValues.map((table) => {
					const tableComponent = tableComponentMap[table];

					return (
						<div
							key={table}
							className={cn(
								"m-2 flex items-center rounded-md border p-1 hover:bg-muted",
								table === selectedTag && "bg-muted"
							)}
							onClick={() => {
								setSelectedTag(table);
							}}
						>
							<tableComponent.icon
								size={18}
								className="ml-1 mr-2 flex-shrink-0 cursor-pointer"
							/>
							<div className="m-1 line-clamp-1 break-all">
								{getTableName(table)}
							</div>
						</div>
					);
				})}
			</ScrollArea>
		</>
	);
}

function CompTableView() {
	const { selectedTable } = useContext(dataTableContext);

	return (
		<>
			{ShowTableEnumValues.filter((table) => table === selectedTable).map(
				(selectedTable) => {
					return (
						<div key={selectedTable} className="flex h-full">
							{React.cloneElement<TableComponentProps>(
								getTableComponent(selectedTable).component,
								{}
							)}
						</div>
					);
				}
			)}
		</>
	);
}