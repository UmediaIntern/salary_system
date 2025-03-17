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

const PageCalendar: NextPageWithLayout = () => {
	const { t } = useTranslation(["nav", "common"]);
	return (
		<>
			{/* Header */}
			<Header title={t("calendar")} showOptions />
			<div className="flex h-full min-h-0 w-full grow flex-col">
				{/* Toolbar */}
				<div className="h-16 shrink-0 px-4 py-2">
					<div className="flex h-full w-full justify-center rounded-md bg-secondary">
						Functions
					</div>
				</div>
				<div className="flex min-h-0 grow flex-row ">
					{/* left pane */}
					<div className="flex w-1/4 max-w-[400px] flex-col items-center p-4">
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
					</div>
					{/* main calendar */}
					<div className="grow">
						<ScrollArea className="h-full">
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
						</ScrollArea>
					</div>
				</div>
			</div>
		</>
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
