import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import { Header } from "~/components/header";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";

// import { AppSidebar } from "~/components/app-sidebar"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { i18n, locales } from '~/components/lang_config'


const PageCalendar: NextPageWithLayout = () => {
  const { t } = useTranslation(['nav', 'common']);
	return (
		<>
			{/* header */}
			<Header title={t("roles")} showOptions />
      <SidebarProvider>
      {/* <AppSidebar /> */}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
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
  return ({props: {
    ...(await serverSideTranslations(locale, ["common", "nav"], i18n, locales)),
  }});
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
