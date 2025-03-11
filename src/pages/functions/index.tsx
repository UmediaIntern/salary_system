import { RootLayout } from "~/components/layout/root_layout";
import {
	CardFunction,
	CardFunctionIcon,
} from "~/components/functions/card_function";
import type { CardFunctionData } from "~/components/functions/card_function";
import { motion } from "framer-motion";
import { type NextPageWithLayout } from "../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { IconCoins } from "~/components/icons/svg_icons";
import { Header } from "~/components/header";
import { useRouter } from "next/router";
import { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import PeriodSelector from "~/components/period_selector";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { ToastAction } from "~/components/ui/toast";

import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { i18n, locales } from '~/components/lang_config'
import { type I18nType } from "~/lib/utils/i18n_type";
import { usePeriodContext } from "~/components/context/period_context_provider";

type FunctionLinkData = CardFunctionData & { url: string | null };

const function_data: (t: I18nType) => FunctionLinkData[] = (t) => [
	{
		title: t("others.month_salary"),
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
		url: "/functions/month_salary",
	},
	{
		title: t("others.foreign_workers_bonus"),
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
		url: "/functions/month_salary",
	},
	{
		title: t("others.employee_trust"),
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
		url: null,
	},
	{
		title: t("others.quarterly_bonus"),
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
		url: null,
	},
	{
		title: t("others.employee_dividends"),
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
		url: null,
	},
];

const PageHome: NextPageWithLayout = () => {
	const router = useRouter();
	const { selectedPeriod, selectedPayDate } = usePeriodContext();
	const { toast } = useToast();
	const [open, setOpen] = useState(false);
	const { t } = useTranslation(['common', 'nav'])

	return (
		<>
			<Header title={t("functions", { ns: "nav" })} showOptions className="mb-4" />
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<PeriodSelector />
				</DialogContent>
			</Dialog>
			<motion.div
				className="m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
				variants={container}
				initial="hidden"
				animate="visible"
			>
				{function_data(t).map((f_data: FunctionLinkData) => (
					<motion.div
						key={f_data.title}
						variants={stagger}
						className="cursor-pointer"
						onClick={() => {
							if (!selectedPeriod || !selectedPayDate) {
								toast({
									title: "",
									description:
										t("others.select_period_and_issue_date"),
									action: (
										<ToastAction
											altText="Go to select period and paydate"
											onClick={() => {
												setOpen(true);
											}}
										>
											{t("button.select")}
										</ToastAction>
									),
								});
							} else {
								void router.push(f_data.url ?? "/functions");
							}
						}}
					>
						<CardFunction
							title={f_data.title}
							iconPath={f_data.iconPath}
							subscript={f_data.subscript}
						>
							<CardFunctionIcon className="text-foreground">
								<IconCoins />
							</CardFunctionIcon>
						</CardFunction>
					</motion.div>
				))}
			</motion.div>
		</>
	);
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
	return ({
		props: {
			...(await serverSideTranslations(locale, ["common", "nav"], i18n, locales)),
		}
	});
};

PageHome.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="functions">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageHome;

const container = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.1,
		},
	},
};

const stagger = {
	hidden: { opacity: 0, y: -100 },
	visible: { opacity: 1, y: 0 },
};
