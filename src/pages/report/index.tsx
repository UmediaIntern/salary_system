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
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

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
import { styles } from "./document_style";

// UI
import { Header } from "~/components/header";
import { Dialog } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { PeriodSelector } from "~/components/period_selector";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from "~/components/ui/select";
import { LoadingSpinner } from "~/components/loading";

// API
import { api } from "~/utils/api";
import { convertDatas, splitGroupByKeys } from "./utils";


// ! TEST
import { TESTComponent } from "./components/test";
// High Level Components
import { Viewer } from "./components/viewer";
import { ErrorComponent } from "./components/error";
import { DownloadComponent } from "./components/download";
import { ColumnsSelector } from "./components/columns_selector";


interface Data {key: string; value: string;}

const MyDocument = ({
	title: title,
	columns: columns,
	datas: datas,
	groupByKeys: groupByKeys,
	check: check,
	t: t
}: {
	title: string
	columns: number
	datas: Array<Array<Data>>
	groupByKeys?: Array<string>
	check?: boolean,
	t: (t: string | string[]) => string
}) => {

	const [columnStyle, setColumnStyle] = useState(styles.column2);
	const [PDFdata, setPDFdata] = useState(datas);

	function Translate(key: string) {
		return t([`TODO.${key}`, `table.${key}`, `others.${key}`]);
	};

	useEffect(() => {
		if (columns === 4) 			setColumnStyle(styles.column4);
		else if (columns === 3) 	setColumnStyle(styles.column3);
		else 						setColumnStyle(styles.column2);
	}, [columns]);

	return <Document title="TEST">
		{datas.map((data) => <Page style={styles.page}>
			<View>
                {/* TITLE */}
				<View style={styles.titleContainer}>
					<Text style={styles.title}>{title}</Text>
					{groupByKeys?.map(gk => Translate(gk)).map(k => {
						const keyData = data.find(d => d.key === k);
						return <Text style={styles.groupKey}>{keyData!.key}-<Text style={ {textDecoration: 'underline'} }>{keyData!.value}</Text></Text>
					})}
				</View>
				<View style={styles.container}>
                    {/* Column 1 */}
					{(groupByKeys ? data.filter((d) => !groupByKeys.map(gk => Translate(gk)).includes(d.key)) : data).map((d) => {
						
						// const usedColumnStyle = (columns == 4 && d.key.length <= 5) ? columnStyle : styles.column4_2;
						const usedColumnStyle = columnStyle;

						return (
							<View style={usedColumnStyle} key={d.key}>
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
	const all_total_data = api.report.getAllTotal.useQuery({
		period_id: selectedPeriod?.period_id ?? 0,
		pay_type: "month_salary",
	})

	// const isLoading = total_data.isLoading || department_total_data.isLoading || all_total_data.isLoading;
	// const isError 	= total_data.isError   || department_total_data.isError   || all_total_data.isError;
	const isFetched = total_data.isFetched && department_total_data.isFetched && all_total_data.isFetched;

	const TotalDocument 			= () => isFetched ? 
		<MyDocument title={"合計"} columns={columns} groupByKeys={splitGroupByKeys(total_data!.data![0]!.name)} datas={convertDatas(total_data!.data![0]!.data ?? [], t, columns)} check={check} t={t}/> 
		: <></>

	const DepartmentTotalDocument 	= () => isFetched ? 
		<MyDocument title={"部門合計"} 	columns={columns} groupByKeys={splitGroupByKeys(department_total_data!.data![0]!.name)} datas={convertDatas(department_total_data!.data![0]!.data ?? [], t, columns)} check={check} t={t}/> 
		: <></>

	const AllTotalDocument          = () => isFetched ?
		<MyDocument title={"總合計"} 	columns={columns} datas={convertDatas(all_total_data!.data![0]!.data ?? [], t, columns)} check={check} t={t}/> 
		: <></>

	return (
		<>
			{/* {isLoading && <LoadingSpinner />}
			{isError   && <ErrorComponent />} */}
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
						<TESTComponent data={total_data.data} display={false}/>
					</div>
					<div className="flex mr-4">
						{reportName === "合計" 		&& <DownloadComponent Document={TotalDocument} 	filename={"合計"} t={t}/>}
						{reportName === "部門合計" 	&& <DownloadComponent Document={DepartmentTotalDocument} filename={"部門合計"} t={t}/>}
						{reportName === "總合計" 	&& <DownloadComponent Document={AllTotalDocument} filename={"總合計"} t={t}/>}
					</div>
				</div>
				<div className="m-4">
					{reportName === "合計" 		&& <Viewer Document={TotalDocument} columns={columns}/>}
					{reportName === "部門合計"	&& <Viewer Document={DepartmentTotalDocument} columns={columns}/>}
					{reportName === "總合計" 	&& <Viewer Document={AllTotalDocument} columns={columns}/>}
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