import { useTranslation } from "react-i18next";
import { PopoverMultiSelector } from "../popover_multi_selector";
import { Badge } from "../ui/badge";
import { type SyncDataAndStatus } from "./update_table";
import { WorkStatusEnum, WorkStatusEnumType, convertFromDBWorkStatusEnum } from "~/server/api/types/work_status_enum";

interface SelectDepartmentProps {
	data: SyncDataAndStatus[];
	selectedKeys: Set<string>;
	setSelectedKeys: (key: Set<string>) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}

export function SelectDepartment({
	data,
	selectedKeys,
	setSelectedKeys,
	open,
	setOpen,
}: SelectDepartmentProps) {
	const { t } = useTranslation(["common"]);

	const departments = new Set<string>();
	const changed_departments = new Set<string>();
	const new_employee_departments = new Set<string>();

	data.forEach((d) => {
		const is_new_employee = d.comparisons.some(
			({ key, ehr_value }) =>
				key === "work_status" &&
				([
					WorkStatusEnum.Values.NewEmployee,
					WorkStatusEnum.Values.NewEmployeeFullMonth,
					WorkStatusEnum.Values.NewEmployeePartialMonth,
				] as WorkStatusEnumType[])
					.includes(convertFromDBWorkStatusEnum(ehr_value))
		);
		if (is_new_employee) {
			new_employee_departments.add(d.department.ehr_value);
		}
		else if (d.department.salary_value !== d.department.ehr_value) {
			changed_departments.add(d.department.salary_value ?? d.department.ehr_value);
		}
		departments.add(d.department.salary_value ?? d.department.ehr_value);
	});

	const departmentsOptions = Array.from(departments).map((d) => {
		return {
			key: d,
			value: d,
			option: <div>
				{d}
				{new_employee_departments.has(d) && (
					<Badge variant="outline" className="ml-1">
						{t("sync_page.new_employee")}
					</Badge>
				)}
				{changed_departments.has(d) && (
					<Badge variant="outline" className="ml-1">
						{t("sync_page.new_department")}
					</Badge>
				)}
			</div>,
		};
	});

	return (
		<PopoverMultiSelector
			data={departmentsOptions}
			selectedKeys={selectedKeys}
			setSelectedKeys={setSelectedKeys}
			open={open}
			setOpen={setOpen}
			placeholder={t("button.select")}
			emptyPlaceholder={t("button.select")}
		/>
	);
}
