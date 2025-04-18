import { RootLayout } from "~/components/layout/root_layout";

import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import { Header } from "~/components/header";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { useTranslation } from "react-i18next";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n, locales } from "~/components/lang_config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Roles } from "./components/roles/roles";
import { CurrentUserCard } from "./components/current_user_card";
import { Accounts } from "./components/accounts/accounts";

const PageRoles: NextPageWithLayout = () => {
	const { t } = useTranslation(["nav", "common"]);
	return (
		<div className="flex h-full w-full flex-col">
			{/* header */}
			<Header title={t("roles")} showOptions />
			<div className="flex h-0 grow flex-col p-4">
				<CurrentUserCard />
				<Tabs defaultValue="roles" className="flex grow flex-col pt-4">
					<TabsList className="grid w-[500px] grid-cols-2">
						<TabsTrigger value="roles">Roles</TabsTrigger>
						<TabsTrigger value="accounts">Accounts</TabsTrigger>
					</TabsList>
					<TabsContent value="roles" className="h-0 w-full grow pt-4">
						<Roles />
					</TabsContent>
					<TabsContent value="accounts" className="w-full grow pt-2">
						<Accounts />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

PageRoles.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="roles">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageRoles;

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
