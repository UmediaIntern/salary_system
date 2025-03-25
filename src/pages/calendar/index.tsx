import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../_app";
import { useState, type ReactElement } from "react";
import { Header } from "~/components/header";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n, locales } from "~/components/lang_config";
import { format, startOfToday, add, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { MonthGrid } from "./month_grid";

const PageCalendar: NextPageWithLayout = () => {
	const { t } = useTranslation(["nav", "common"]);

	const today = startOfToday();
	const [selectedYear, setSelectedYear] = useState(format(today, "y"));
	const [selectedMonth, setSelectedMonth] = useState<Date>(
		startOfMonth(today)
	);

	// const firstDaySelectedYear = parse(selectedYear, "y", new Date());

	function previousYear() {
		const firstDayNextYear = add(selectedYear, { years: -1 });
		setSelectedYear(format(firstDayNextYear, "y"));
	}

	function nextYear() {
		const firstDayNextYear = add(selectedYear, { years: 1 });
		setSelectedYear(format(firstDayNextYear, "y"));
	}

	function setToday() {
		setSelectedYear(format(today, "y"));
	}

	return (
		<>
			{/* Header */}
			<Header title={t("calendar")} showOptions />
			<div className="flex h-full min-h-0 w-full grow flex-col">
				{/* Toolbar */}
				<div className="h-16 shrink-0 px-4 py-2">
					<div className="flex h-full w-full items-center justify-between rounded-md bg-secondary">
						{/* Left side */}
						<div className="flex flex-row items-center gap-2 px-2">
							<Button
								onClick={previousYear}
								variant="outline"
								className="h-8 w-8 p-0"
							>
								<ChevronLeft />
							</Button>
							<div className="flex items-center align-middle font-bold">
								{format(selectedYear, "yyyy")}
							</div>
							<Button
								onClick={nextYear}
								variant="outline"
								className="h-8 w-8 p-0"
							>
								<ChevronRight />
							</Button>
							<Button
								className="h-8 px-1 py-0"
								onClick={setToday}
							>
								{" "}
								Today{" "}
							</Button>
						</div>
					</div>
				</div>
				{/* Main content */}
				<div className="flex min-h-0 grow flex-row">
					{/* left pane */}
					{/* <div className="flex w-1/4 max-w-[400px] flex-col items-center p-4"> */}
					{/* 	<div className="flex w-full justify-center rounded-md bg-secondary"> */}
					{/* 		<Calendar */}
					{/* 			mode="single" */}
					{/* 			fixedWeeks */}
					{/* 			captionLayout="dropdown-buttons" */}
					{/* 			fromYear={new Date().getFullYear() - 30} */}
					{/* 			toYear={new Date().getFullYear() + 30} */}
					{/* 			className="w-fit" */}
					{/* 		/> */}
					{/* 	</div> */}
					{/* </div> */}
					{/* main calendar */}
					<div className="relative grow">
						<div className="h-full w-full px-4">
							<MonthGrid monthStart={selectedMonth} />
						</div>
						{/* <ScrollArea className="relative min-h-full h-full bg-green-400"> */}
						{/* 	<YearlyCalendarGrid yearStart={selectedYear} /> */}
						{/* </ScrollArea> */}
					</div>
				</div>
			</div>
		</>
	);
};

PageCalendar.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="calendar">{page}</PerpageLayoutNav>
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
