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

function excludeDataColumn(dataList: any[], excludedColumns: Array<string>) {
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
			data: sheetData,
		};
	});
}

function ExportPage() {
	const { selectedPeriod } = usePeriodContext();
	const [selectedExcelIndex, setSelectedExcelIndex] = useState(0);
	const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
	const [toExcludedColumns, setToExcludedColumns] = useState([
		"id",
		"create_by",
		"create_date",
		"update_by",
		"update_date",
		"disable",
	]);
	const [toDisplayData, setToDisplayData] = useState<any>(null);


	// ! Declare All Excel Data
	const all_data_api: {
		transaction?: 	ReturnType<typeof api.report.getTransactionIndividual.useQuery>;
		test?: 			ReturnType<typeof api.report.getTransactionIndividual.useQuery>;
	} = {};

	type AllDataApiKeys = keyof typeof all_data_api;

	const all_data_isPending: Partial<Record<AllDataApiKeys, boolean>> = {};
	const all_data_content:   Partial<Record<AllDataApiKeys, ReactNode>> = {};
	const all_data: {
		transaction?: 	(Transaction|null)[];
		test?: 			(any|null)[];
	} = {};


	// ! Declare Excel Order
	const excel_order: (keyof typeof all_data_api)[] = [
		'transaction',
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

	
	all_data_api['test'] = api.report.getTransactionIndividual.useQuery({
		period_id: selectedPeriod?.period_id ?? 0,
		pay_type: "month_salary",
	});
	all_data_isPending['test'] = transactionIsPending;
	all_data_content['test'] = transactionContent;
	all_data['test'] = [{name: "test", data: [
		{test1: "test1", test2: "test2", test3: "test3"},
		{test1: "test1", test2: "test2", test3: "test3"},
	]}, {name: "second_sheet", data: [
		{test4: "test1", test5: "test2", test6: "test3"},
		{test4: "test1", test5: "test2", test6: "test3"},
	]}];


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
					<Button variant="outline">Keys</Button>
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

	function SelectExcelComponent() {
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
											{excel_name}
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
							excludeDataColumn(all_data[excel_order[selectedExcelIndex]!] ?? [], toExcludedColumns)
						)
					}
					filter_component={<FilterComponent />}
					selectedExcelComponent={<SelectExcelComponent />}
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
