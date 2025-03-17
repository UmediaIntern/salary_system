import Head from "next/head";
import { useState, type PropsWithChildren } from "react";
import { NavSidebar } from "~/components/nav_sidebar/nav_sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { PeriodContextProvider } from "../context/period_context_provider";

type PerpageLayoutProp = {
	pageTitle: string;
};

export const PerpageLayoutNav = (
	props: PropsWithChildren<PerpageLayoutProp>
) => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<>
			<Head>
				{/* basic meta */}
				<title>{props.pageTitle}</title>
				<meta name="description" content="Salary system" />
				<link rel="icon" href="/favicon.ico" />
				{/* mobile mata */}
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
			</Head>
			<main className="min-h-screen bg-background">
				<PeriodContextProvider>
					<SidebarProvider className="max-h-screen">
						<NavSidebar isCollapsed={isCollapsed} />
						<SidebarInset className="min-w-0">
							{props.children}
						</SidebarInset>
					</SidebarProvider>
				</PeriodContextProvider>
			</main>
		</>
	);
};
