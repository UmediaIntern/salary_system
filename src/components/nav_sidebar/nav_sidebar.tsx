import { usePathname } from "next/navigation";
import { type HTMLAttributes } from "react";
import {
	GanttChartSquare,
	LayoutGrid,
	Settings,
	ShieldCheck,
	SlidersHorizontal,
	CheckSquare,
	CalendarRange,
	Contact,
	CircleDollarSign,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "~/components/ui/sidebar";
import { SidebarPeriodSelector } from "./sidebar_period_selector";
import { SidebarGroupLinks, type NavLinkEntry } from "./sidebar_group_links";
import { type AccessFEType } from "~/server/api/types/access_page_type";
import { useAccessContext } from "../context/access_context_provider";

function navLinks(
	data: AccessFEType
): Record<"action" | "setting" | "test", NavLinkEntry[]> {
	return {
		action: [
			{
				title: "functions",
				icon: LayoutGrid,
				url: "/functions",
				collapsed: false,
				accessible: data.functions,
			},
			{
				title: "synchronize",
				icon: CheckSquare,
				url: "/synchronize",
				collapsed: false,
				accessible: data.synchronize,
			},
			{
				title: "employees",
				icon: Contact,
				url: "/employees",
				collapsed: false,
				accessible: data.employees,
			},
			{
				title: "parameters",
				icon: SlidersHorizontal,
				url: "/parameters",
				collapsed: false,
				accessible: data.parameters,
			},
			{
				title: "bonus",
				icon: CircleDollarSign,
				url: "/bonus",
				collapsed: false,
				accessible: data.bonus,
			},
			{
				title: "calendar",
				icon: CalendarRange,
				url: "/calendar",
				collapsed: false,
				accessible: data.calendar,
			},
		],
		setting: [
			{
				title: "settings",
				icon: Settings,
				url: "/settings",
				collapsed: false,
				accessible: data.settings,
			},
			{
				title: "roles",
				icon: ShieldCheck,
				url: "/roles",
				collapsed: false,
				accessible: data.roles,
			},
			{
				title: "report",
				icon: GanttChartSquare,
				url: "/report",
				collapsed: false,
				accessible: data.report,
			},
		],
		test: [
			{
				title: "test transaction",
				icon: CircleDollarSign,
				url: "/test",
				collapsed: false,
				accessible: false,
			},
		],
	};
}

interface NavSidebarProp extends HTMLAttributes<HTMLDivElement> {
	isCollapsed: boolean;
}
// https://www.flaticon.com/free-icon-font/coins_7928197?related_id=7928197
export function NavSidebar({}: NavSidebarProp) {
	const pathname = usePathname();
	const { access } = useAccessContext();

	const { t } = useTranslation(["nav", "common"]);

	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader>
				<SidebarPeriodSelector />
			</SidebarHeader>
			<SidebarContent>
				{/* Action */}
				<SidebarGroupLinks
					groupTitle={t("actions")}
					navLinks={navLinks(access).action}
					currentPath={pathname}
				/>
				{/* Setting */}
				<SidebarGroupLinks
					groupTitle={t("configurations")}
					navLinks={navLinks(access).setting}
					currentPath={pathname}
				/>
				{/* Test */}
				<SidebarGroupLinks
					groupTitle={t("configurations")}
					navLinks={navLinks(access).test}
					currentPath={pathname}
				/>
				{/* */}
			</SidebarContent>
			<SidebarFooter></SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
