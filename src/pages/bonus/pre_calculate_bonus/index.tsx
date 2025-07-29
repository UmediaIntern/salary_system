import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";
import { ReactElement, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n, locales } from "~/components/lang_config";
import DataTableContextProvider from "../components/context/data_table_context_provider";
import { ProgressBar } from "~/components/functions/progress_bar";
import { Button } from "~/components/ui/button";
import BonusFilter from "./bonus_filter";
import BonusBudget from "./bonus_budget";
import BonusExcelExport from "./bonus_excel_export";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import { BonusTypeSelector } from "../components/bonus_type_selector";
import dataTableContext from "../components/context/data_table_context";
import { formatDate } from "~/lib/utils/format_date";

type BonusStepPage = {
	title: string;
	page: ReactElement;
};

const BonusHomePageContent = () => {
	const { t } = useTranslation(["common", "nav"]);
	const { selectedBonusType, selectedIssueDate } =
		useContext(dataTableContext);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const pageList: BonusStepPage[] = [
		{
			title: t("others.bonus_filter"),
			page: <BonusFilter />,
		},
		{
			title: t("others.bonus_budget"),
			page: <BonusBudget />,
		},
		{
			title: t("others.bonus_excel_export"),
			page: <BonusExcelExport />,
		},
	];
	const titles: string[] = pageList.map((page) => page.title);

	return (
		<div className="flex h-full flex-col">
			<Header
				title={t("bonus", { ns: "nav" })}
				showOptions
				className="mb-4"
			/>
			<div className="flex flex-row items-center">
				<div className="ml-4 h-full min-w-[140px]">
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								className="h-full w-full flex-col"
							>
								<div className="flex-1">
									{t(`table.${selectedBonusType}`)}
								</div>
								<div className="flex-1 text-xs">
									{selectedIssueDate
										? formatDate("day", selectedIssueDate)
										: t("others.not_set", { ns: "common" })}
								</div>
							</Button>
						</DialogTrigger>
						<BonusTypeSelector
							setSelectedIndex={setSelectedIndex}
						/>
					</Dialog>
				</div>
				<div className="mx-4 grow">
					<ProgressBar
						labels={titles}
						selectedIndex={selectedIndex}
					/>
				</div>
			</div>
			<div className="m-4 flex min-h-0 grow">
				{pageList[selectedIndex]?.page ?? <></>}
			</div>
			<div className="mx-4 mb-4 flex justify-between">
				{selectedIndex != 0 ? (
					<Button onClick={() => setSelectedIndex(selectedIndex - 1)}>
						{t("button.previous_step")}
					</Button>
				) : (
					<div />
				)}
				{selectedIndex != titles.length - 1 && (
					<Button onClick={() => setSelectedIndex(selectedIndex + 1)}>
						{t("button.next_step")}
					</Button>
				)}
			</div>
		</div>
	);
};

const BonusHomePage: NextPageWithLayout = () => {
	return (
		<DataTableContextProvider>
			<BonusHomePageContent />
		</DataTableContextProvider>
	);
};

BonusHomePage.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="Bonus">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default BonusHomePage;

export const getStaticProps = async ({ locale }: { locale: string }) => {
	return {
		props: {
			...(await serverSideTranslations(
				locale,
				["common", "nav"],
				i18n,
				locales,
			)),
		},
	};
};
