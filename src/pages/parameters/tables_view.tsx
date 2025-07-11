import { createElement, useEffect, useState, type ComponentType } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { AttendanceTable } from "./tables/attendance_table";
import { BankTable } from "./tables/bank_table";
import { InsuranceRateTable } from "./tables/insurance_rate_table";
import { cn } from "~/lib/utils";
import {
	ActivitySquare,
	Clock,
	CreditCard,
	Landmark,
	type LucideIcon,
	Table,
} from "lucide-react";
import { DataTableContextProvider, useDataTableContext } from "./components/context/data_table_context_provider";
import { getTableNameKey } from "./components/context/data_table_enum";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
	type ParameterTableEnum,
	ParameterTableEnumValues,
} from "./parameter_tables";
import { LevelRangeTable } from "./tables/level_range_table";
import { LevelTable } from "./tables/level_table";
import { useTranslation } from "react-i18next";
import { TrustMoneyTable } from "./tables/trust_money_table";
import { SalaryIncomeTaxTable } from "./tables/salary_income_tax_table";
import { IncomeTaxSettingTable } from "./tables/income_tax_setting_table";
import { usePeriodContext } from "~/components/context/period_context_provider";
import { AllowanceRangeTable } from "./tables/allowance_range_table";

export type TableComponentProps = {
	period_id: number;
	globalFilter?: string;
};

type TableComponent = {
	component: ComponentType<TableComponentProps>;
	icon: LucideIcon;
};

function getTableComponent(
	table: ParameterTableEnum,
): TableComponent {
	switch (table) {
		case "TableAttendance":
			return {
				component: AttendanceTable,
				icon: Clock,
			};
		case "TableBankSetting":
			return {
				component: BankTable,
				icon: CreditCard,
			};
		case "TableInsurance":
			return {
				component: InsuranceRateTable,
				icon: ActivitySquare,
			};
		case "TableTrustMoney":
			return {
				component: TrustMoneyTable,
				icon: Landmark,
			};
		case "TableLevelRange":
			return {
				component: LevelRangeTable,
				icon: Table,
			};
		case "TableLevel":
			return {
				component: LevelTable,
				icon: Table,
			};
		case "TableSalaryIncomeTax":
			return {
				component: SalaryIncomeTaxTable,
				icon: Table,
			}
		case "TableIncomeTaxSetting":
			return {
				component: IncomeTaxSettingTable,
				icon: Table,
			}
    case "TableAllowanceRange":
      return {
        component: AllowanceRangeTable,
        icon: Table,
      }
		default:
			throw new Error(`Invalid table`);
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
	const [selectedTag, setSelectedTag] = useState<ParameterTableEnum>(
		ParameterTableEnumValues[0]
	);

	const { setSelectedTableType } = useDataTableContext();

	const tableComponentMap: Record<ParameterTableEnum, TableComponent> =
		ParameterTableEnumValues.reduce((map, table) => {
			map[table] = getTableComponent(table);
			return map;
		}, {} as Record<ParameterTableEnum, TableComponent>);

	useEffect(() => {
		setSelectedTableType(selectedTag);
	}, [selectedTag, setSelectedTableType]);

	const { t } = useTranslation(['common']);

	return (
		<div className="flex h-full flex-col">
			<div className="flex h-[48px] items-center justify-center text-lg">
				<div>{t("table.tables")} </div>
			</div>
			<Separator />
			<div className="h-0 grow">
				<ScrollArea className="h-full">
					{ParameterTableEnumValues.map((table) => {
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
									{t(getTableNameKey(table))}
								</div>
							</div>
						);
					})}
				</ScrollArea>
			</div>
		</div>
	);
}

function CompTableView() {
	const { selectedTableType } = useDataTableContext();
	const { selectedPeriod } = usePeriodContext();;

	const { t } = useTranslation(['common']);

	return (
		<>
			{ParameterTableEnumValues.filter(
				(table) => table === selectedTableType
			).map((selectedTableType) => {
				return (
					<div key={selectedTableType} className="flex h-full">
						{selectedPeriod ? createElement<TableComponentProps>(
							getTableComponent(selectedTableType).component,
							{ period_id: selectedPeriod.period_id }
						) : <p>{t("others.select_period")}</p>}
					</div>
				);
			})}
		</>
	);
}
