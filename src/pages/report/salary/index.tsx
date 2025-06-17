import { useState } from "react";
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
import { ExcelViewer } from "./excel_viewer";

// Functions
import { api } from "~/utils/api";
import { getExcelData, getDefaults } from "./utils";
import { usePeriodContext } from "~/components/context/period_context_provider";
import { useQueryHandle } from "~/components/query_boundary/query_handle";

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

	const getExcelA = api.report.getTransactionIndividual.useQuery({
		period_id: selectedPeriod?.period_id ?? 0,
		pay_type: "month_salary",
	});

	const { isPending, content, data } = useQueryHandle(getExcelA);

	function createSchema() {
		const keys = getExcelA.isFetched
			? Object.keys(
				getExcelA!.data!.map((sheet: any) =>
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
											getExcelA.data!,
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

	if (isPending) {
		return content;
	}

	return (
		<ExcelViewer
			original_sheets={
				toDisplayData ??
				getExcelData(
					excludeDataColumn(data, toExcludedColumns)
				)
			}
			filter_component={<FilterComponent />}
			selectedSheetIndex={selectedSheetIndex}
			setSelectedSheetIndex={setSelectedSheetIndex}
		/>
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
