import { RootLayout } from "~/components/layout/root_layout";
import { Header } from "~/components/header";
import { type NextPageWithLayout } from "../_app";
import React, { type ReactElement } from "react";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import TablesView from "./tables_view";
import { useTranslation } from "react-i18next";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n, locales } from "~/components/lang_config";
import { usePeriodContext } from "~/components/context/period_context_provider";
import { SelectPeriodAlert } from "~/components/select_period_alert";

const PageParameters: NextPageWithLayout = () => {
	const { selectedPeriod } = usePeriodContext();
	const { t } = useTranslation("common");

	if (selectedPeriod === null) {
		return (
			<div className="m-4 grow">
				<SelectPeriodAlert />
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col">
			<Header title={t("table.parameters")} showOptions />

			<div className="m-4 h-0 grow rounded-md border-2">
				<TablesView />
			</div>
		</div>
	);
};

PageParameters.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="parameters">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageParameters;

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
