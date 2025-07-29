import { ScrollArea } from "~/components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { displayData } from "~/components/synchronize/utils/display";
import { cn } from "~/lib/utils";
import {
	SyncDataDisplayModeEnum,
	type SyncDataDisplayModeEnumType,
} from "~/components/synchronize/utils/data_display_mode";

import { useTranslation } from "react-i18next";
import { Checkbox } from "../ui/checkbox";
import {
	type DataComparisonAndStatus,
	type SyncDataAndStatus,
} from "./update_table";
import { CheckCheck, CircleCheckBigIcon } from "lucide-react";
import { Button } from "../ui/button";

interface EmployeeDataChangeAllProps {
	data: SyncDataAndStatus[];
	mode: SyncDataDisplayModeEnumType;
	setDataStatus: (emp_no: string, key?: string, checked?: boolean) => void;
}

export function EmployeeDataChangeTable({
	data,
	mode,
	setDataStatus,
}: EmployeeDataChangeAllProps) {
	const { t } = useTranslation(["common"]);
	return (
		<>
			<ScrollArea className="h-full overflow-y-auto rounded-md border text-center">
				<Table>
					<TableHeader className="bg-secondary">
						<TableRow className="sticky top-0 bg-secondary hover:bg-secondary z-10">
							<TableHead className="text-center">
								{t("table.department")}
							</TableHead>
							<TableHead className="text-center">
								{t("table.emp_no")}
							</TableHead>
							<TableHead className="text-center">
								{t("table.emp_name")}
							</TableHead>
							<TableHead className="text-center">
								{t("table.key")}
							</TableHead>
							<TableHead className="text-center">
								{t("table.salary_data")}
							</TableHead>
							<TableHead className="text-center">
								{t("table.ehr_data")}
							</TableHead>
							<TableHead className="text-center">
								{t("sync_page.check")}
							</TableHead>
							<TableHead className="text-center">
								{t("sync_page.all_(un)click")}
							</TableHead>
						</TableRow>
					</TableHeader>
					{data.map((d: SyncDataAndStatus, _index: number) => {
						// Filter data based on mode
						let comparisons: DataComparisonAndStatus[] = d.comparisons;

						if (mode === SyncDataDisplayModeEnum.Values.changed) {
							comparisons = d.comparisons.filter(
								(c: DataComparisonAndStatus) => c.is_different
							);
						}

						// Get row span
						const rowSpan = comparisons.length;

						return (
							<>
								<TableBody className="hover:bg-muted/50">
									{comparisons.map(
										(
											c: DataComparisonAndStatus,
											index: number
										) => {
											const diff = c.is_different;

											return (
												<TableRow
													key={c.key}
													className="hover:bg-transparent"
												>
													{/* Department */}
													{index === 0 ? (
														<TableCell
															// className={cn("font-medium align-top", d.department.is_different && "text-red-500")}
															className="font-medium align-top"
															rowSpan={rowSpan}
														>
															<div className="sticky top-16">
																{d.department.salary_value ?? d.department.ehr_value}
															</div>
														</TableCell>
													) : (
														<></>
													)}
													{/* Emp No */}
													{index === 0 ? (
														<TableCell
															className="font-medium align-top"
															rowSpan={rowSpan}
														>
															<div className="sticky top-16">
																{d.emp_no}
															</div>
														</TableCell>
													) : (
														<></>
													)}
													{/* Name */}
													{index === 0 ? (
														<TableCell
															// className={cn("font-medium align-top", d.name.is_different && "text-red-500")}
															className="font-medium align-top"
															rowSpan={rowSpan}
														>
															<div className="sticky top-16">
																{d.name.salary_value ?? d.name.ehr_value}
															</div>
														</TableCell>
													) : (
														<></>
													)}
													{/* Data Field Name */}
													<TableCell className="font-medium">
														{t(`table.${c.key}`)}
													</TableCell>
													{/* Salary Data */}
													<TableCell
														className={cn(
															"min-w-[180px] font-medium",
															diff &&
															"text-red-500"
														)}
													>
														{displayData(
															c.salary_value,
															t
														)}
													</TableCell>
													{/* EHR Data */}
													<TableCell
														className={cn(
															"min-w-[180px] font-medium",
															diff &&
															"text-red-500"
														)}
													>
														{displayData(
															c.ehr_value,
															t
														)}
													</TableCell>
													<TableCell className="flex h-14 items-center justify-center p-0">
														{diff ? (
															<Checkbox
																className="border-red-500 data-[state=checked]:bg-red-500"
																checked={
																	c.check_status ===
																	"checked"
																}
																onCheckedChange={(
																	checked
																) =>
																	setDataStatus(
																		d.emp_no,
																		c.key,
																		checked === true,
																	)
																}
															/>
														) : (
															<CircleCheckBigIcon
																width={16}
																className="text-green-500"
															/>
														)}
													</TableCell>
													{index === 0 ? (
														<TableCell
															className={cn("align-top")}
															rowSpan={rowSpan}
														>
															<div className="flex sticky top-16 justify-center">
																<Button
																	variant="link"
																	size="sm"
																	className="h-6 w-6 p-0 lg:flex bg-transparent text-black rounded border-black border"
																	onClick={() => setDataStatus(d.emp_no)}
																>
																	<CheckCheck className="h-4 w-4" />
																</Button>
															</div>
														</TableCell>
													) : (
														<></>
													)}
												</TableRow>
											);
										}
									)}
								</TableBody>
							</>
						);
					})}
					<TableFooter></TableFooter>
				</Table>
			</ScrollArea>
		</>
	);
}
