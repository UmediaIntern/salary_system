import { type NextPageWithLayout } from "../_app";
import { Header } from "~/components/header";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { type ReactElement } from "react";
import { useTranslation } from "react-i18next";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n, locales } from "~/components/lang_config";
import { usePeriodContext } from "~/components/context/period_context_provider";
import { SelectPeriodAlert } from "~/components/select_period_alert";
import TablesView from "./tables_view";

const PageEmployees: NextPageWithLayout = () => {
	const { t } = useTranslation(["common", "nav"]);
	const { selectedPeriod } = usePeriodContext();

	if (selectedPeriod === null) {
		return (
			<div className="m-4 grow">
				<SelectPeriodAlert />
			</div>
		);
	}

	return (
		<div className="flex h-full w-full flex-col">
			<Header
				title={t("employees", { ns: "nav" })}
				showOptions
			/>
			<div className="m-4 h-0 grow">
				<TablesView />
			</div>
		</div>
	)
};

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

PageEmployees.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="employees">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageEmployees;
