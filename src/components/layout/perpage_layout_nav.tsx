import Head from "next/head";
import { useState, type PropsWithChildren, useRef } from "react";
import { NavSidebar } from "~/components/sidebar";
import { cn } from "~/lib/utils";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "~/components/ui/sidebar";

import { type ImperativePanelHandle } from "react-resizable-panels";
import PeriodContextProvider from "../context/period_context_provider";

type PerpageLayoutProp = {
	pageTitle: string;
};

export const PerpageLayoutNav = (
	props: PropsWithChildren<PerpageLayoutProp>
) => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const ref = useRef<ImperativePanelHandle>(null);

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
					<SidebarProvider>
						<NavSidebar
							isCollapsed={isCollapsed}
							collapseFunction={() => ref.current?.collapse()}
							expandFunction={() => ref.current?.expand()}
						/>
						<SidebarInset>
							<div className="h-full w-full">
								<SidebarTrigger className="-ml-1" />
								{props.children}
							</div>{" "}
						</SidebarInset>
					</SidebarProvider>
				</PeriodContextProvider>
			</main>
		</>
	);
};
