import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { HolidayTable } from "../tables/holiday_table";
import { OvertimeTable } from "../tables/overtime_table";
import { PaysetTable } from "../tables/payset_table";
import { BonusTable } from "../tables/bonus_table";
import { OtherTable } from "../tables/other_table";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { type FunctionsEnumType } from "~/server/api/types/functions_enum";
import { useTranslation } from "react-i18next";
import { PayTypeEnum } from "~/server/api/types/pay_type_enum";
import { AllowanceTable } from "../tables/allowance_table";
import { useQueryHandle } from "~/components/query_boundary/query_handle";

const tabOptions = ["table_name.allowance", "table_name.overtime", "table_name.holiday", "table_name.other", "table_name.bonus", "table_name.payset"];

function getTable(table_name: string, emp_no_list: string[], period_id: number) {
	switch (table_name) {
		case tabOptions[0]:
			return <AllowanceTable period_id={period_id} emp_no_list={emp_no_list} />;
		case tabOptions[1]:
			return <OvertimeTable period_id={period_id} emp_no_list={emp_no_list} pay_type={PayTypeEnum.Enum.month_salary} />;
		case tabOptions[2]:
			return <HolidayTable period_id={period_id} emp_no_list={emp_no_list} />;
		case tabOptions[3]:
			return <OtherTable period_id={period_id} emp_no_list={emp_no_list} />;
		case tabOptions[4]:
			return <BonusTable period_id={period_id} emp_no_list={emp_no_list} pay_type={PayTypeEnum.Enum.month_salary} />;
		case tabOptions[5]:
			return <PaysetTable period_id={period_id} emp_no_list={emp_no_list} />;
		default:
			return <p>No implement</p>;
	}
}

export function DataPage({
	period_id,
	func,
	selectedIndex,
	setSelectedIndex,
}: {
	period_id: number;
	func: FunctionsEnumType;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}) {

	const { t } = useTranslation("common");

	const getPaidEmp = api.sync.getPaidEmployees.useQuery({ period_id, func })
	const {data, isPending, content} = useQueryHandle(getPaidEmp)

	if (isPending) {
		return content
	}

	const emp_no_list = data.map(emp => emp.emp_no)

	return (
		<>
			<div className="h-0 grow">
				<Tabs
					defaultValue={tabOptions[0]}
					className="flex h-full w-full flex-col"
				>
					<TabsList className={cn(`grid grid-cols-6`)}>
						{tabOptions.map((option) => {
							return (
								<TabsTrigger key={option} value={option}>
									{t(option)}
								</TabsTrigger>
							);
						})}
					</TabsList>
					<div className="mt-2 h-0 grow">
						{tabOptions.map((option) => {
							return (
								<TabsContent key={option} value={option} className="h-full">
									{period_id > 0 ? getTable(option, emp_no_list, period_id) : <></>}
								</TabsContent>
							);
						})}
					</div>
				</Tabs>
			</div>
			<div className="mt-4 flex justify-between">
				<Button
					onClick={() => setSelectedIndex(selectedIndex - 1)}
				>
					{t("button.previous_step")}
				</Button>
				<Button
					onClick={() => setSelectedIndex(selectedIndex + 1)}
				>
					{t("button.next_step")}
				</Button>
			</div>
		</>
	);
}
