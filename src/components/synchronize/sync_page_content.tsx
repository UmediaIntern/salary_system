import { useEffect, useState } from "react";
import { SelectModeComponent } from "~/components/synchronize/select_mode";
import {
	type SyncDataAndStatus,
	UpdateTableDialog,
} from "~/components/synchronize/update_table";
import {
	SyncDataDisplayModeEnum,
	type SyncDataDisplayModeEnumType,
} from "~/components/synchronize/utils/data_display_mode";
import { SelectEmployee } from "~/components/synchronize/select_employee";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { useTranslation } from "next-i18next";
import { EmployeeDataChangeTable } from "./emp_data_change_table";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	SyncDataSelectModeEnum,
	type SyncDataSelectModeEnumType,
	syncDataSelectModeString,
} from "./utils/select_mode";
import { SelectDepartment } from "./select_department";
import { type SyncData } from "~/server/api/types/sync_type";
import { convertToKey, WorkStatusEnumType } from "~/server/api/types/work_status_enum";
import { formatDate } from "~/lib/utils/format_date";

export function SyncPageContent({ data }: { data: SyncData[] }) {
	const [mode, setMode] = useState<SyncDataDisplayModeEnumType>(
		SyncDataDisplayModeEnum.Values.changed
	);
	const [filterMode, setFilterMode] = useState<SyncDataSelectModeEnumType>(
		SyncDataSelectModeEnum.Values.all_emp
	);

	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
	const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(
		new Set()
	);

	const [open, setOpen] = useState(false);

	// Status
	const [dataWithStatus, setDataWithStatus] = useState<SyncDataAndStatus[]>(
		[]
	);
	const [filterData, setFilterData] = useState<SyncDataAndStatus[]>([]);

	const { t } = useTranslation(["common"]);

	useEffect(() => {
		setDataWithStatus(
			data.map((d) => {
				return {
					emp_no: d.emp_no.ehr_value,
					name: d.name,
					english_name: d.english_name,
					department: d.department,
					comparisons: d.comparisons.map((c) => {
						let salaryValue = c.salary_value;
						let ehrValue = c.ehr_value;
						switch (c.key) {
							case "work_status":
								salaryValue = salaryValue ? t(`work_status.${convertToKey(c.salary_value as WorkStatusEnumType)}`) : salaryValue;
								ehrValue = t(`work_status.${convertToKey(c.ehr_value as WorkStatusEnumType)}`);
								break;
							case "residence_permit_start_date":
							case "residence_permit_end_date":
							case "registration_date":
							case "quit_date":
								salaryValue =  salaryValue ? formatDate("day", c.salary_value) : salaryValue;
								ehrValue = ehrValue ? formatDate("day", c.ehr_value) : ehrValue;
								break;
							case "received_elderly_benefits":
								salaryValue = salaryValue ? t(`others.${c.salary_value}`): salaryValue;
								ehrValue = t(`others.${c.ehr_value}`);
								break;
						}

						return {
							key: c.key,
							salary_value: salaryValue,
							ehr_value: ehrValue,
							is_different: c.is_different,
							check_status: "initial",
						};
					}),
				};
			})
		);
	}, [data]);

	/* Filter Data */
	useEffect(() => {
		switch (filterMode) {
			case SyncDataSelectModeEnum.Values.all_emp:
				setFilterData(dataWithStatus);
				break;
			case SyncDataSelectModeEnum.Values.filter_emp:
				setFilterData(() =>
					dataWithStatus.filter((d) => selectedKeys.has(d.emp_no))
				);
				break;
			case SyncDataSelectModeEnum.Values.filter_dep:
				setFilterData(() =>
					dataWithStatus.filter((d) =>
						selectedDepartments.has(d.department.salary_value ?? d.department.ehr_value)
					)
				);
				break;
		}
	}, [dataWithStatus, filterMode, selectedKeys, selectedDepartments]);

	function CompAllDonePage() {
		return (
			<div className="flex h-0 w-full flex-grow items-center justify-center">
				<Card className="w-1/2 text-center">
					<CardHeader className="p-2 pt-0 md:p-4">
						<CardTitle className="p-4">
							{t("others.up_to_date")}
						</CardTitle>
						<CardDescription>
							{t("others.up_to_date_msg")}
						</CardDescription>
					</CardHeader>
					<CardContent className="p-2 pt-0 md:p-4 md:pt-0"></CardContent>
				</Card>
			</div>
		);
	}

	function CompTopBar() {
		return (
			<>
				<div className="mb-4 flex items-center">
					<Select
						value={filterMode}
						onValueChange={(v) =>
							setFilterMode(v as SyncDataSelectModeEnumType)
						}
					>
						<SelectTrigger className="mr-2 w-[180px]">
							<SelectValue placeholder="Select a fruit" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem
									value={
										SyncDataSelectModeEnum.Values.all_emp
									}
								>
									{t(
										`sync_page.${syncDataSelectModeString(
											SyncDataSelectModeEnum.Values
												.all_emp
										)}`
									)}
								</SelectItem>
								<SelectItem
									value={
										SyncDataSelectModeEnum.Values.filter_emp
									}
								>
									{t(
										`sync_page.${syncDataSelectModeString(
											SyncDataSelectModeEnum.Values
												.filter_emp
										)}`
									)}
								</SelectItem>
								<SelectItem
									value={
										SyncDataSelectModeEnum.Values.filter_dep
									}
								>
									{t(
										`sync_page.${syncDataSelectModeString(
											SyncDataSelectModeEnum.Values
												.filter_dep
										)}`
									)}
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					{filterMode ===
						SyncDataSelectModeEnum.Values.filter_emp && (
							<div className="">
								<SelectEmployee
									data={dataWithStatus}
									selectedKeys={selectedKeys}
									setSelectedKeys={setSelectedKeys}
									open={open}
									setOpen={setOpen}
								/>
							</div>
						)}
					{filterMode ===
						SyncDataSelectModeEnum.Values.filter_dep && (
							<div className="">
								<SelectDepartment
									data={dataWithStatus}
									selectedKeys={selectedDepartments}
									setSelectedKeys={setSelectedDepartments}
									open={open}
									setOpen={setOpen}
								/>
							</div>
						)}
					<div className="ml-auto">
						<SelectModeComponent mode={mode} setMode={setMode} />
					</div>
				</div>
			</>
		);
	}

	if (!data || data.length === 0) {
		return <CompAllDonePage />;
	}

	return (
		<>
			{/* Main Content */}
			<CompTopBar />
			<div className="relative h-0 w-full flex-grow ">
				<EmployeeDataChangeTable
					data={filterData}
					mode={mode}
					setDataStatus={(emp_no, key, checked) => {
						setDataWithStatus((prevData) => {
							return prevData.map((employee) => {
								if (employee.emp_no === emp_no) {
									const selected = employee.comparisons.some(
										(c) => c.check_status === "checked"
									);
									const newEmployee = employee.comparisons.every(
										(c) => c.salary_value === null
									);
									return {
										...employee,
										comparisons: employee.comparisons.map((comparison) => {
											if (key === undefined) {
												return {
													...comparison,
													check_status: selected ? "initial" : "checked"
												};
											}
											if (newEmployee) {
												return {
													...comparison,
													check_status: checked ? "checked" : "initial"
												};
											}
											else if (comparison.key === key) {
												return {
													...comparison,
													check_status: checked ? "checked" : "initial"
												};
											}
											return comparison;
										})
									};
								}
								return employee;
							});
						});
					}}
				/>
			</div>
			{/* Bottom Buttons */}
			<div className="ml-auto mt-4 flex justify-between">
				<UpdateTableDialog data={dataWithStatus} />
			</div>
		</>
	);
}
