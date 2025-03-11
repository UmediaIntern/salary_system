import { api } from "~/utils/api";
import { type NextPageWithLayout } from "../_app";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { type ReactElement } from "react";
import { LoadingSpinner } from "~/components/loading";
import { Header } from "~/components/header";
import { SyncPageContent } from "~/components/synchronize/sync_page_content";
import { FunctionsEnum } from "~/server/api/types/functions_enum";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { i18n, locales } from '~/components/lang_config'
import { usePeriodContext } from "~/components/context/period_context_provider";


const PageCheckEHR: NextPageWithLayout = () => {
	const {selectedPeriod} = usePeriodContext();
	const { t } = useTranslation(['common', 'nav']);
	if (selectedPeriod == null) {
		return <p>{t("others.select_period")}</p>;
	}
	return <SyncPage />;
};

function SyncPage() {
	const {selectedPeriod} = usePeriodContext();
	const { t } = useTranslation(['common', 'nav']);

	const { isLoading, isError, data, error } =
		api.sync.checkEmployeeData.useQuery({
			func: FunctionsEnum.Enum.month_salary,
			period_id: selectedPeriod!.period_id,
		});

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return data != null ? (
		<div className="flex h-full w-full flex-col">
			<Header title={t("synchronize", { ns: "nav" })} showOptions className="mb-4" />
			<div className="mx-4 flex h-0 grow">
        <div className="w-full flex flex-col mb-4">
          <SyncPageContent data={data} />
        </div>
			</div>
		</div>
	) : (
		<div>{t("table.no_data")}</div>
	);
}

PageCheckEHR.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="check">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageCheckEHR;

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return ({props: {
    ...(await serverSideTranslations(locale, ["common", "nav"], i18n, locales)),
  }});
};

