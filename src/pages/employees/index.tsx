import { type NextPageWithLayout } from "../_app";
import { Header } from "~/components/header";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { type ReactElement } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { EmployeeDataTable } from "./tables/employee_data_table";
import { EmployeePaymentTable } from "./tables/employee_payment/employee_payment_table";
import { EmployeeTrustTable } from "./tables/employee_trust/employee_trust_table";
import {
	EmployeeTableContextProvider,
	useEmployeeTableContext,
} from "./components/context/data_table_context_provider";
import { useTranslation } from "react-i18next";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n, locales } from "~/components/lang_config";
import {
	EmployeeTableEnumValues,
	type EmployeeTableEnum,
	getTableNameKey,
} from "./employee_tables";
import { TabMountGuard } from "./components/context/tab_mount_guard";
import { usePeriodContext } from "~/components/context/period_context_provider";
import { SelectPeriodAlert } from "~/components/select_period_alert";

function PageEmployeesContent() {
	const { setSelectedTableType } = useEmployeeTableContext();
	const { t } = useTranslation(["common", "nav"]);

	function getTable(table_type: EmployeeTableEnum) {
		switch (table_type) {
			case "TableEmployee":
				return <EmployeeDataTable />;
			case "TableEmployeePayment":
				return <EmployeePaymentTable />;
			case "TableEmployeeTrust":
				return <EmployeeTrustTable />;
			default:
				return <p>No implement</p>;
		}
	}

	return (
		<div className="flex h-full w-full flex-col">
			<Header
				title={t("employees", { ns: "nav" })}
				showOptions
				className="mb-4"
			/>
			<div className="m-4 h-0 grow">
				<Tabs
					defaultValue={EmployeeTableEnumValues[0]}
					className="flex h-full flex-col"
				>
					<TabsList className={"grid w-full grid-cols-3"}>
						{EmployeeTableEnumValues.map((option) => {
							return (
								<TabsTrigger
									key={option}
									value={option}
									onClick={() => setSelectedTableType(option)}
								>
									{t(getTableNameKey(option))}
								</TabsTrigger>
							);
						})}
					</TabsList>
					<div className="mt-2 h-0 grow">
						{EmployeeTableEnumValues.map((option) => {
							return (
								<TabsContent
									key={option}
									value={option}
									className="h-full"
								>
									<TabMountGuard tableType={option}>
										{getTable(option)}
									</TabMountGuard>
								</TabsContent>
							);
						})}
					</div>
				</Tabs>
			</div>
		</div>
	);
}

const PageEmployees: NextPageWithLayout = () => {
	const { selectedPeriod } = usePeriodContext();

	if (selectedPeriod === null) {
		return (
			<div className="m-4 grow">
				<SelectPeriodAlert />
			</div>
		);
	}

	return (
		<EmployeeTableContextProvider period_id={selectedPeriod.period_id}>
			<PageEmployeesContent />
		</EmployeeTableContextProvider>
	);
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
