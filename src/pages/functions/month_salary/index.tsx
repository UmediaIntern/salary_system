import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";
import { type NextPageWithLayout } from "../../_app";
import { api } from "~/utils/api";
import { type ReactElement, useState } from "react";
import { ProgressBar } from "~/components/functions/progress_bar";
import { LoadingSpinner } from "~/components/loading";
import { DataPage } from "./data_page";
import { EmployeeCandidatePage } from "./employee_candidate_page";
import { SyncPage } from "./sync_page";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useRouter } from "next/router";
import { SalaryCalculatePage } from "./salary_calculate_page";
import { FunctionsEnum } from "~/server/api/types/functions_enum";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { i18n, locales } from '~/components/lang_config'
import { ParameterPage } from "./parameters_page";
import { Period } from "~/server/database/entity/UMEDIA/period";
import { usePeriodContext } from "~/components/context/period_context_provider";
import { PaidEmployee } from "~/server/api/types/sync_type";
import { EmployeePage } from "./employee_page";

type FunctionStepPage = {
	title: string;
	page: ReactElement;
};

const MonthSalary: NextPageWithLayout = () => {
	const { selectedPeriod } = usePeriodContext();

	const periodId = selectedPeriod?.period_id;
	const { t } = useTranslation(['common'])

	if (!periodId) {
		return (
			<div className="flex h-full flex-col items-center justify-center p-4">
				<div className="my-6 font-bold ">
					{t("others.select_period_and_issue_date")}
				</div>
				<Link
					className={cn(
						buttonVariants({ variant: "outline" }),
						"w-40"
					)}
					href="/functions"
				>
					{t("button.previous_page")}
				</Link>
			</div>
		);
	}

	return <MonthSalaryContent period={selectedPeriod} />;
};

function MonthSalaryContent({ period }: { period: Period }) {
	const periodId = period.period_id;
	const router = useRouter();
	const [selectedIndex, setSelectedIndex] = useState(0);

	const { t } = useTranslation(['common', 'nav'])

	const { isLoading, isError, data, error } =
		api.sync.getCandEmployees.useQuery({
			func: FunctionsEnum.enum.month_salary,
			period: periodId,
		});

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	const pageList: FunctionStepPage[] = [
		{
			title: t("others.sync_employee_data"),
			page: (
				<SyncPage
					key="sync"
					period_id={periodId}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
				/>
			),
		},
		{
			title: t("others.confirm_employee"),
			page: (
				<EmployeePage
					key="employee"
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
				/>
			),
		},
		{
			title: t("others.confirm_parameter"),
			page: (
				<ParameterPage
					key="parameter"
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
				/>
			),
		},
		{
			title: t("others.comfirm_employee_list"),
			page: (
				<EmployeeCandidatePage
					key="employee"
					period_id={periodId}
					func={FunctionsEnum.enum.month_salary}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
				/>
			),
		},
		{
			title: t("others.comfirm_data"),
			page: (
				<DataPage
					key="data"
					period_id={periodId}
					func={FunctionsEnum.enum.month_salary}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
				/>
			),
		},
		{
			title: t("others.calculate_salary"),
			page: (
				<SalaryCalculatePage
					key="salary_calculate"
					period={period}
					func={FunctionsEnum.enum.month_salary}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
				/>
			),
		},
	];
	const titles: string[] = pageList.map((page) => page.title);

	// const hasBug = data.some((cand) => cand.bug !== undefined);
	const hasBug = false;

	return (
		<AlertDialog
			open={hasBug}
			onOpenChange={(open) => {
				if (!open) {
					void router.replace("/functions");
				}
			}}
		>
			<div className="flex flex-col h-full">
				<Header title={t("functions", { ns: "nav" })} showOptions />
				<div className="flex flex-col grow p-4">
					<ProgressBar labels={titles} selectedIndex={selectedIndex} />
					<div className="h-4" />
					{pageList[selectedIndex]?.page ?? <></>}
				</div>
			</div>
			{(data) ? <CompAlert data={data} /> : <div />}
		</AlertDialog>
	);
}

function CompAlert({ data }: { data: PaidEmployee[] }) {
	const { t } = useTranslation(['common'])
	return (
		<AlertDialogContent className="w-[90vw]">
			<AlertDialogHeader>
				<AlertDialogTitle>{t("other.sync_error")}</AlertDialogTitle>
				<AlertDialogDescription>{t("other.sync_error_msg")}</AlertDialogDescription>
			</AlertDialogHeader>
			<div className="m-4">
				{data.map((cand) => {
					return (
						cand.bug && (
							<div
								key={cand.emp_no}
								className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
							>
								<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
								<div className="space-y-1">
									<p className="text-sm font-medium leading-none">
										{`${cand.name} (${cand.emp_no})`}
									</p>
									<p className="text-sm text-muted-foreground">
										{cand.bug}
									</p>
								</div>
							</div>
						)
					);
				})}
			</div>
			<AlertDialogFooter>
				<AlertDialogAction>{t("button.confirm")}</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	);
}

MonthSalary.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="functions">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default MonthSalary;

export const getStaticProps = async ({ locale }: { locale: string }) => {
	return ({
		props: {
			...(await serverSideTranslations(locale, ["common", "nav"], i18n, locales)),
		}
	});
};

