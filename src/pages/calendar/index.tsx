import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import { Header } from "~/components/header";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n, locales } from "~/components/lang_config";
import { Calendar } from "~/components/ui/calendar";
import { ScrollArea } from "~/components/ui/scroll-area";

// {/* header */}
// {/* <Header title={t("roles")} showOptions /> */}

const PageCalendar: NextPageWithLayout = () => {
	const { t } = useTranslation(["nav", "common"]);
	return (
		<div className="min-h-0 h-full w-full flex-1 overflow-auto">
			<div className="h-[2000px] w-4 bg-red-200" />

			{/* <div className="h-16 px-4 py-2">
					<div className="flex h-full w-full justify-center rounded-md bg-secondary"></div>
				</div>
				<div className="relative flex grow flex-row"> */}
			{/* left pane */}
			{/* <div className="flex h-full w-1/4 max-w-[400px] flex-col items-center p-4">
						<div className="flex w-full justify-center rounded-md bg-secondary">
							<Calendar
								mode="single"
								fixedWeeks
								captionLayout="dropdown-buttons"
								fromYear={new Date().getFullYear() - 30}
								toYear={new Date().getFullYear() + 30}
								className="w-fit"
							/>
						</div>
					</div> */}
			{/* main calendar */}
			{/* <div className="h-full min-h-0 grow overflow-auto bg-green-500">
						<div className="flex flex-1 flex-col gap-4 p-4">
							<div className="grid auto-rows-min gap-4 md:grid-cols-5">
								{Array.from({ length: 20 }).map((_, i) => (
									<div
										key={i}
										className="aspect-square rounded-xl bg-muted/50"
									/>
								))}
							</div>
						</div>
					</div> */}
			{/* </div> */}
		</div>
	);
};

PageCalendar.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="roles">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageCalendar;

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

// function CompCalendarView({ target_date }: { target_date: string }) {
// 	const [currenMonth, setCurrentMonth] = useState(
// 		getDayInMonth(target_date, null)
// 	);
// 	const { monthIndex } = useContext(calendarContext);
//
// 	useEffect(() => {
// 		setCurrentMonth(getDayInMonth(target_date, monthIndex));
// 	}, [monthIndex]);
//
// 	return (
// 		<>
// 			<div className="flex h-full flex-col">
// 				<CalendarHeader target_date={target_date} />
// 				<div className="flex h-0 flex-grow">
// 					{/* <ScrollArea className="w-full"> */}
// 					<MonthView month={currenMonth} target_date={target_date} />
// 					{/* </ScrollArea> */}
// 				</div>
// 				<CalendarAddEvent />
// 				<CalendarUpdateEvent />
// 			</div>
// 		</>
// 	);
// }
