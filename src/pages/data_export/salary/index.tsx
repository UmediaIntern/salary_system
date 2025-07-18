import { ReactNode, useState } from "react";
import { z } from "zod";

// Translation
import { useTranslation } from "next-i18next";
import { i18n, locales } from "~/components/lang_config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Layout
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { type NextPageWithLayout } from "../../_app";

// Components
import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";
import { LoadingSpinner } from "~/components/loading";
import { StandardForm } from "~/components/form/default/form_standard";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { ExcelViewer } from "./excel_viewer";

// Functions
import { api } from "~/utils/api";
import { getExcelData, getDefaults } from "./utils";
import { usePeriodContext } from "~/components/context/period_context_provider";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import { Transaction } from "~/server/database/entity/SALARY/transaction";
import { convertToKey as convertToWorkStatusKey } from "~/server/api/types/work_status_enum";
import { convertToKey as convertToWorkTypeKey } from "~/server/api/types/work_type_enum";
import { SalaryOutType } from "~/server/api/types/report_salary_out_type";
import { HILevelRangeType } from "~/server/api/types/report_h_i_level_range_type";
import { LILevelRangeType } from "~/server/api/types/report_l_i_level_range_type";
import { LRLevelRangeType } from "~/server/api/types/report_l_r_level_range_type";
import { HIDetailsOutType } from "~/server/api/types/report_h_i_details_out_range_type";
import { OIInsuranceType } from "~/server/api/types/report_o_i_insurance_type";

const Salary: NextPageWithLayout = () => {
	const { t } = useTranslation("common");
	return (
		<>
			<Header
				title={t("transaction.month_salary_report")}
				showOptions
				className="mb-4"
			/>
			<div className="min-h-0 w-full grow p-4">
				<ExportPage />
			</div>
		</>
	);
};

type KeyValuePair = Record<string, any>;

function excludeDataColumn(t: any, dataList: any[], excludedColumns: Array<string>) {
	return dataList.map((data: any) => {
		const sheetName = data.name;
		const sheetData = data.data.map((row: KeyValuePair) => {
			const newRow: KeyValuePair = {};
			Object.keys(row).forEach((key) => {
				if (!excludedColumns.includes(key)) {
					newRow[key] = row[key];
				}
			});
			return newRow;
		});
		return {
			name: sheetName,
			data: displayMapper(t, sheetData),
		};
	});
}

function displayMapper(t: any, data: any[]) {

	return data.map((row: KeyValuePair) => {
		const newRow: KeyValuePair = {};
		Object.keys(row).forEach((key) => {
			switch (key) {
				case "work_status":
					newRow[key] = t(`work_status.${convertToWorkStatusKey(row[key])}`);
					break;
				case "work_type":
					newRow[key] = t(`work_type.${convertToWorkTypeKey(row[key])}`);
					break;
				case "pay_type":
				case "received_elderly_benefits":
				case "probation_period_over":
				case "has_trust":
					newRow[key] = t(`others.${row[key]}`);
					break;
				default:
					newRow[key] = row[key];
					break;
			}
		});
		return newRow;
	});
}

function ExportPage() {
	const { t } = useTranslation("common");
	const { selectedPeriod } = usePeriodContext();
	const [selectedExcelIndex, setSelectedExcelIndex] = useState(0);
	const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
	const [toExcludedColumns, setToExcludedColumns] = useState([
		"id",
		"create_by",
		"create_date",
		"update_by",
		"update_date",
		"disabled",
		// Exclude other from transaction
	]);
	const [toDisplayData, setToDisplayData] = useState<any>(null);


	// ! Declare All Excel Data
	const all_data_api: {
		transaction?: ReturnType<typeof api.report.getTransactionIndividual.useQuery>;
		transaction_department?: ReturnType<typeof api.report.getTransactionDepartment.useQuery>;
		salary_out?: ReturnType<typeof api.report.getSalaryOut.useQuery>;
		h_i_level_range?: ReturnType<typeof api.report.getHILevelRange.useQuery>;
		l_i_level_range?: ReturnType<typeof api.report.getLILevelRange.useQuery>;
		l_r_level_range?: ReturnType<typeof api.report.getLRLevelRange.useQuery>;
		h_i_details_out?: ReturnType<typeof api.report.getHIDetailsOut.useQuery>;
		o_i_insurance?: ReturnType<typeof api.report.getOIInsurance.useQuery>;
		test?: ReturnType<typeof api.report.getTransactionIndividual.useQuery>;
	} = {};

	type AllDataApiKeys = keyof typeof all_data_api;

	const all_data_isPending: Partial<Record<AllDataApiKeys, boolean>> = {};
	const all_data_content: Partial<Record<AllDataApiKeys, ReactNode>> = {};
	const all_data: {
		transaction?: (Transaction | null)[];
		transaction_department?: (Transaction | null)[];
		salary_out?: (SalaryOutType | null)[];
		h_i_level_range?: (HILevelRangeType | null)[];
		l_i_level_range?: (LILevelRangeType | null)[];
		l_r_level_range?: (LRLevelRangeType | null)[];
		h_i_details_out?: (HIDetailsOutType | null)[];
		o_i_insurance?: (OIInsuranceType | null)[];
		test?: (any | null)[];
	} = {};


	// ! Declare Excel Order
	const excel_order: (keyof typeof all_data_api)[] = [
		'transaction',
		'transaction_department',
		'h_i_level_range',
		'l_i_level_range',
		'l_r_level_range',
		'h_i_details_out',
		'o_i_insurance',
		'salary_out',
		'test',
	]


	// & Assign Excel Data From API
	all_data_api['transaction'] = api.report.getTransactionIndividual.useQuery({
		period_id: selectedPeriod?.period_id ?? 0,
		pay_type: "month_salary",
	});
	const { isPending: transactionIsPending, content: transactionContent, data: transactionData } = useQueryHandle(all_data_api['transaction']);
	all_data_isPending['transaction'] = transactionIsPending;
	all_data_content['transaction'] = transactionContent;
	all_data['transaction'] = transactionData as (Transaction | null)[];

	all_data_api['transaction_department'] = api.report.getTransactionDepartment.useQuery({
		period_id: selectedPeriod?.period_id ?? 0,
		pay_type: "month_salary",
	});
	const { isPending: transactionDepartmentIsPending, content: transactionDepartmentContent, data: transactionDepartmentData } = useQueryHandle(all_data_api['transaction_department']);
	all_data_isPending['transaction_department'] = transactionDepartmentIsPending;
	all_data_content['transaction_department'] = transactionDepartmentContent;
	all_data['transaction_department'] = transactionDepartmentData as (Transaction | null)[];

	all_data_api['salary_out'] = api.report.getSalaryOut.useQuery({ period_id: selectedPeriod?.period_id ?? 0, pay_type: "month_salary", });
	const { isPending: salaryOutIsPending, content: salaryOutContent, data: salaryOutData } = useQueryHandle(all_data_api['salary_out']);
	all_data_isPending['salary_out'] = salaryOutIsPending;
	all_data_content['salary_out'] = salaryOutContent;
	all_data['salary_out'] = salaryOutData as (SalaryOutType | null)[];

	all_data_api['h_i_level_range'] = api.report.getHILevelRange.useQuery({ period_id: selectedPeriod?.period_id ?? 0, pay_type: "month_salary", });
	const { isPending: HILevelRangeIsPending, content: HILevelRangeContent, data: HILevelRangeData } = useQueryHandle(all_data_api['h_i_level_range']);
	all_data_isPending['h_i_level_range'] = HILevelRangeIsPending;
	all_data_content['h_i_level_range'] = HILevelRangeContent;
	all_data['h_i_level_range'] = HILevelRangeData as (HILevelRangeType | null)[];

	all_data_api['l_i_level_range'] = api.report.getLILevelRange.useQuery({ period_id: selectedPeriod?.period_id ?? 0, pay_type: "month_salary", });
	const { isPending: LILevelRangeIsPending, content: LILevelRangeContent, data: LILevelRangeData } = useQueryHandle(all_data_api['l_i_level_range']);
	all_data_isPending['l_i_level_range'] = LILevelRangeIsPending;
	all_data_content['l_i_level_range'] = LILevelRangeContent;
	all_data['l_i_level_range'] = LILevelRangeData as (LILevelRangeType | null)[];

	all_data_api['l_r_level_range'] = api.report.getLRLevelRange.useQuery({ period_id: selectedPeriod?.period_id ?? 0, pay_type: "month_salary", });
	const { isPending: LRLevelRangeIsPending, content: LRLevelRangeContent, data: LRLevelRangeData } = useQueryHandle(all_data_api['l_r_level_range']);
	all_data_isPending['l_r_level_range'] = LRLevelRangeIsPending;
	all_data_content['l_r_level_range'] = LRLevelRangeContent;
	all_data['l_r_level_range'] = LRLevelRangeData as (LRLevelRangeType | null)[];

	all_data_api['h_i_details_out'] = api.report.getHIDetailsOut.useQuery({ period_id: selectedPeriod?.period_id ?? 0, pay_type: "month_salary", });
	const { isPending: HIDetailsOutIsPending, content: HIDetailsOutContent, data: HIDetailsOutData } = useQueryHandle(all_data_api['h_i_details_out']);
	all_data_isPending['h_i_details_out'] = HIDetailsOutIsPending;
	all_data_content['h_i_details_out'] = HIDetailsOutContent;
	all_data['h_i_details_out'] = HIDetailsOutData as (HIDetailsOutType | null)[];

	all_data_api['o_i_insurance'] = api.report.getOIInsurance.useQuery({ period_id: selectedPeriod?.period_id ?? 0, pay_type: "month_salary", });
	const { isPending: OIInsuranceIsPending, content: OIInsuranceContent, data: OIInsuranceData } = useQueryHandle(all_data_api['o_i_insurance']);
	all_data_isPending['o_i_insurance'] = OIInsuranceIsPending;
	all_data_content['o_i_insurance'] = OIInsuranceContent;
	all_data['o_i_insurance'] = OIInsuranceData as (OIInsuranceType | null)[];

	function createSchema() {
		const selectedExcel = excel_order[selectedExcelIndex]!;
		const keys = all_data_api[selectedExcel]?.isFetched
			? Object.keys(
				all_data[selectedExcel]!.map((sheet: any) =>
					sheet.data.length > 0 ? sheet.data[0] : []
				)[selectedSheetIndex]
			)
			: [];
		const schemaShape = keys.reduce((acc: any, key) => {
			if (toExcludedColumns.includes(key)) {
				acc[key] = z.boolean().optional().default(false);
			} else {
				acc[key] = z.boolean().optional().default(true);
			}
			return acc;
		}, {});
		const schema = z.object(schemaShape);
		return schema;
	}

	function FilterComponent() {
		const [open, setOpen] = useState(false);
		return (
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger>
					<Button variant="outline">{t("button.keys")}</Button>
				</SheetTrigger>
				<SheetContent className="w-[40%]">
					<SheetHeader>
						<SheetTitle></SheetTitle>
						<SheetDescription></SheetDescription>
					</SheetHeader>
					<ScrollArea className="h-[85%] w-full">
						<StandardForm
							formSchema={createSchema()}
							formConfig={undefined}
							defaultValue={getDefaults(createSchema())}
							formSubmit={(data) => {
								setOpen(false);
								// changeShowKeys("Sheet1", data);
								const newExcludedColumns = [];
								for (const [key, value] of Object.entries(
									data
								)) {
									if (!value) newExcludedColumns.push(key);
								}
								setToExcludedColumns(newExcludedColumns);
								setToDisplayData(
									getExcelData(
										excludeDataColumn(
											t,
											all_data['transaction'] ?? [],
											newExcludedColumns
										)
									)
								);
							}}
							buttonText={"save"}
							closeSheet={() => setOpen(false)}
						/>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</SheetContent>
			</Sheet>
		);
	}

	function SelectExcelComponent({ t }: {
		t: any
	}) {
		const selectedExcel = excel_order[selectedExcelIndex]!;
		return (
			<>
				<Select
					value={selectedExcel}
					onValueChange={(value) => {
						setSelectedExcelIndex(excel_order.indexOf(value as keyof typeof all_data_api));
					}}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select a sheet" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Excels</SelectLabel>
							{excel_order.map(
								(excel_name: string) => {
									console.log(excel_name);
									return (
										<SelectItem
											key={excel_name}
											value={excel_name}
										>
											{t(`others.${excel_name}`)}
										</SelectItem>
									);
								}
							)}
						</SelectGroup>
					</SelectContent>
				</Select>
			</>
		);
	}



	if (all_data_isPending['transaction']) {
		return all_data_content['transaction'];
	}

	return (
		<>
			<div className="flex h-full flex-col">
				{/* <Button onClick={() => {console.log(selectedPeriod?.period_id, transactionData)}} variant={"destructive"}>	
					TEST
				</Button> */}
				<ExcelViewer
					original_sheets={
						toDisplayData ??
						getExcelData(
							excludeDataColumn(t, all_data[excel_order[selectedExcelIndex]!] ?? [], toExcludedColumns)
						)
					}
					filter_component={<FilterComponent />}
					selectedExcelComponent={<SelectExcelComponent t={t} />}
					selectedSheetIndex={selectedSheetIndex}
					selected_excel_name={excel_order[selectedExcelIndex]!}
					setSelectedSheetIndex={setSelectedSheetIndex}
				/>
			</div>
		</>
	);
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
	return {
		props: {
			...(await serverSideTranslations(
				locale,
				["common", "nav"],
				i18n,
				locales
			)),
		},
	};
};

Salary.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="month_salary_report">
				{page}
			</PerpageLayoutNav>
		</RootLayout>
	);
};

export default Salary;
