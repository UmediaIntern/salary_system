// S123alary
// Layout
import { NextPageWithLayout } from "../_app";
import { ReactElement, useState, useEffect } from "react";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";

// Translations
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n, locales } from "~/components/lang_config";

// Hooks
import { usePeriodContext } from "~/components/context/period_context_provider";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

// PDF
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	PDFDownloadLink,
	PDFViewer,
	Font,
} from "@react-pdf/renderer";
import lightFont from "./fonts/LXGWWenKaiMonoTC-Light.ttf";
import boldFont from "./fonts/LXGWWenKaiMonoTC-Regular.ttf";

// UI
import { Header } from "~/components/header";
import { Dialog } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { PeriodSelector } from "~/components/period_selector";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from "~/components/ui/select";


// API
import { api } from "~/utils/api";
import { isDate } from "util/types";
import { displayData } from "~/components/synchronize/utils/display";
import { TFunction } from "i18next";
import { LoadingSpinner } from "~/components/loading";

interface Data {key: string; value: string;}
Font.register({family: "bold", src: boldFont,});
Font.register({family: "light",src: lightFont,});

const MyDocument = ({
	title: title,
	columns: columns,
	datas: datas,
	check: check,
	t: t
}: {
	title: string
	columns: number
	datas: Array<Array<Data>>
	check?: boolean,
	t: (t: string | string[]) => string
}) => {
	const styles = StyleSheet.create({
		page: {
			padding: 20,
		},
		titleContainer: {
			flexDirection: 'row',
			left: "30%",
			justifyContent: 'flex-start',
		},
		title: {
			fontSize: 30,
			fontWeight: "bold",
			textAlign: "left",
			marginBottom: 20,
			fontFamily: "bold",
		},
		groupKey: {
			top: 10,
			fontSize: 15,
			fontWeight: "bold",
			marginRight: 20,
			fontFamily: "bold",
			left: '10%',
		},
		text: {
			fontSize: 11,
			textAlign: "left",
			fontFamily: "light",
			marginBottom: 10,
		},
		container: {
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent: "space-between",
		},
		column2: {
			padding: 5,
			width: "48%", 
		},
		column3: {
			padding: 5,
			width: "33%",
		},
		column4: {
			padding: 3,
			width: "24%",
		},

		rightBottomTextContainer: {
			top: 20,
			flexDirection: 'row',    // 水平排列
			left: "50%",
			justifyContent: 'flex-start', // 左對齊
		},
		rightBottomText: {
			fontFamily: "light",
			fontSize: 25,
			// textAlign: 'left',
			marginBottom: 10,
			marginRight: 5,         // 增加或減少右側間距以減少兩者之間的距離
		},
		rightBottomSign: {
			fontFamily: "light",
			fontSize: 25,
			// textAlign: 'left',
			textDecoration: 'underline',  // 下劃線
		},
	});


	const [columnStyle, setColumnStyle] = useState(styles.column2);
	const [PDFdata, setPDFdata] = useState(datas);

	useEffect(() => {
		if (columns === 4) 			setColumnStyle(styles.column4);
		else if (columns === 3) 	setColumnStyle(styles.column3);
		else 						setColumnStyle(styles.column2);
	}, [columns]);

	// ~ PAD DATAS
	useEffect(() => {
		
	}, [datas])


	return <Document title="TEST">
		{datas.map((data) => <Page style={styles.page}>
			<View>
                {/* TITLE */}
				<View style={styles.titleContainer}>
					<Text style={styles.title}>{title}</Text>
					{data[0] && <Text style={styles.groupKey}>{data[0]!.key}-{data[0]!.value}</Text>}
				</View>
				<View style={styles.container}>
                    {/* Column 1 */}
					{data.slice(1).map((d) => {
					return (
						<View style={columnStyle} key={d.key}>
							{d.key !== "" && (
								<Text style={styles.text}>
									{d.key}: <Text style={[styles.text, { textDecoration: 'underline' }]}>{d.value}</Text>
								</Text>
							)}
						</View>
					);
				})}
				</View>
				<View style={styles.rightBottomTextContainer}>
					<Text style={[styles.rightBottomText]}>{t(["TODO.Review"])}: </Text>
					<Text style={[styles.rightBottomSign]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
				</View>
				<View style={styles.rightBottomTextContainer}>
					<Text style={[styles.rightBottomText]}>{t(["TODO.Approve"])}: </Text>
					<Text style={[styles.rightBottomSign]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
				</View>
				
			</View>
		</Page>)}
	</Document>
};

const Viewer = ({
	Document: Document
}: {
	Document: () => JSX.Element
}) => (
	<PDFViewer width="100%" height="600">
		<Document />
	</PDFViewer>
);

const ErrorComponent = () => <div>Error</div>;

const DownloadComponent = ({
	Document: Document,
	t,
}: {
	Document: () => JSX.Element,
	t: TFunction<[string], undefined>
}) => {
	const [loading, setLoading] = useState(false);
	return <>
		<Button variant={"outline"} disabled={loading}>
			<PDFDownloadLink document={<Document />} fileName="test.pdf">
				{/* t([`table.${cell.content}`, `others.${cell.content}`, `TODO.${cell.content}`]) */}
				{({ loading }) => {
					setLoading(loading);
					return t([`TODO.${(loading ? "generating_PDF" : "download_PDF")}`])
				}}
			</PDFDownloadLink>
		</Button>
	</>
}

const ColumnsSelector = ({
	columns: columns,
	setColumns: setColumns,
	t: t
}: {
	columns: number,
	setColumns: (columns: number) => void,
	t: (t: string | string[]) => string
}) => {
	const availableColumns = [2, 3, 4];

	const [selectedColumns, setSelectedColumns] = useState(columns.toString());

	return <>
		<div>
			<Select
				value={columns.toString()}
				onValueChange={(value) => {
					setColumns(parseInt(value));
					setSelectedColumns(value);
				}}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Select a sheet" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>{t("TODO.Columns")}</SelectLabel>
						{availableColumns.map(
							(column) => {
								return (
									<SelectItem
										key={column}
										value={column.toString()}
									>
										{column} {t(["TODO.columns"])}
									</SelectItem>
								);
							}
						)}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	</>
}

const ReportSelector = ({
	reportName: reportName,
	setReportName: setReportName,
	t: t
}: {
	reportName: string,
	setReportName: (reportName: string) => void,
	t: (t: string | string[]) => string
}) => {
	const availableReports = ["合計", "部門合計", "總合計", "薪資內容"];
	return <>
		<Select
			value={reportName}
			onValueChange={(value) => {
				setReportName(value);
			}}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select a sheet" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>{t("TODO.Reports")}</SelectLabel>
					{availableReports.map(
						(a_report) => {
							return (
								<SelectItem
									key={a_report}
									value={a_report.toString()}
								>
									{a_report}
								</SelectItem>
							);
						}
					)}
				</SelectGroup>
			</SelectContent>
		</Select>
	</>
}

const convert2string = (data: any, t: TFunction<[string], undefined>) => {
	return displayData(data, t);
}

const convertData = (data: any, t: TFunction<[string], undefined>) => {
	return Object.keys(data).map((key) => {
		return {
			key: t([`others.${key}`, `button.${key}`, `TODO.${key}`, `table.${key}`]),
			value: convert2string(data[key], t) as string
		}
});}

const convertDatas = (datas: any[], t: TFunction<[string], undefined>, columns: number) => {
	return datas.map((data) => {
		const tmpData = convertData(data, t);
		for (let i = 0; i < columns - tmpData.length%columns; i++) {
			tmpData.push({ key: "", value: "" });
		}
		return tmpData;
	});
}

const testDatas = [[
	{ key: "test", value: "test" },
	{ key: "test2", value: "test2" },
	{ key: "test3", value: "test3" },
	{ key: "test4", value: "test4" },
	{ key: "test5", value: "test5" },
	{ key: "test6", value: "test6" },
],
[
	{ key: "test", value: "test" },
	{ key: "test2", value: "test2" },
	{ key: "test3", value: "test3" },
	{ key: "test4", value: "test4" },
]]


const ReportHomePage: NextPageWithLayout = () => {
	const { t } 						= useTranslation(["common", "nav"]);
	const { selectedPeriod } 			= usePeriodContext();
	const [open, setOpen] 				= useState(false);
	const [columns, setColumns] 		= useState(4);
	const [reportName, setReportName] 	= useState("合計");
	const [check, setCheck] 			= useState(false);

	const total_data = api.report.getTotal.useQuery({
		period_id: selectedPeriod?.period_id ?? 0,
		pay_type: "month_salary",
	});
	const department_total_data = api.report.getDepartmentTotal.useQuery({
		period_id: selectedPeriod?.period_id ?? 0,
		pay_type: "month_salary",
	})

	const isLoading = total_data.isLoading || department_total_data.isLoading;
	const isError 	= total_data.isError   || department_total_data.isError;
	const isFetched = total_data.isFetched && department_total_data.isFetched;

	const TotalDocument 			= () => isFetched ? 
		<MyDocument title={"合計"} columns={columns} datas={convertDatas(total_data!.data![0]!.data ?? [], t, columns)} check={check} t={t}/> 
		: <></>

	const DepartmentTotalDocument 	= () => isFetched ? 
		<MyDocument title={"部門合計"} 	columns={columns} datas={convertDatas(department_total_data!.data![0]!.data ?? [], t, columns)} check={check} t={t}/> 
		: <></>

	return (
		<>
			{isLoading && <LoadingSpinner />}
			{isError   && <ErrorComponent />}
			{isFetched && <>
				<Header
					title={t("report", { ns: "nav" })}
					showOptions
					className="mb-4"
				/>
				<Dialog open={open} onOpenChange={setOpen}>
					<PeriodSelector />
				</Dialog>
				
				<div className="mb-4 flex flex-row justify-between">
					<div className="flex space-x-4 ml-4">
						<ReportSelector reportName={reportName} setReportName={setReportName} t={t}/>
						<ColumnsSelector columns={columns} setColumns={setColumns} t={t}/>
					</div>
					<div className="flex mr-4">
						{reportName === "合計" 		&& <DownloadComponent Document={TotalDocument} t={t}/>}
						{reportName === "部門合計" 	&& <DownloadComponent Document={DepartmentTotalDocument} t={t}/>}
					</div>
				</div>
				<div className="m-4">
					{reportName === "合計" 		&& <Viewer Document={TotalDocument} />}
					{reportName === "部門合計"	&& <Viewer Document={DepartmentTotalDocument} />}
				</div>
			</>}
		</>
	);
};

ReportHomePage.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle={"reports"}>{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default ReportHomePage;

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