import { useTranslation } from "react-i18next";
import { PopoverMultiSelector } from "../popover_multi_selector";
import { type SyncDataAndStatus } from "./update_table";
import { Badge } from "../ui/badge";
import { convertFromDBWorkStatusEnum, WorkStatusEnum, WorkStatusEnumType } from "~/server/api/types/work_status_enum";

interface SelectEmployeeProps {
	data: SyncDataAndStatus[];
	selectedKeys: Set<string>;
	setSelectedKeys: (key: Set<string>) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}

export function SelectEmployee({
	data,
	selectedKeys,
	setSelectedKeys,
	open,
	setOpen,
}: SelectEmployeeProps) {
	const { t } = useTranslation(["common"]);

	const foramttedData = data.map((d) => {
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

		const changed_department = d.department.salary_value && d.department.salary_value !== d.department.ehr_value;

		return {
			key: d.emp_no,
			value: `${d.emp_no} ${d.name.salary_value ?? d.name.ehr_value} ${d.english_name.salary_value
				}`,
			option: (
				<div>
					{`${d.emp_no} ${d.name.ehr_value ?? d.name.ehr_value} ${d.english_name.ehr_value ?? d.name.ehr_value
						}`}
					{is_new_employee && (
						<Badge variant="outline" className="ml-1">
							{t("sync_page.new_employee")}
						</Badge>
					)}
					{changed_department && (
						<Badge variant="outline" className="ml-1">
							{t("sync_page.new_department")}
						</Badge>
					)}
				</div>
			),
		};
	});

	return (
		<PopoverMultiSelector
			data={foramttedData}
			selectedKeys={selectedKeys}
			setSelectedKeys={setSelectedKeys}
			open={open}
			setOpen={setOpen}
			placeholder={t("button.select")}
			emptyPlaceholder={t("button.select")}
		/>
	);
}
