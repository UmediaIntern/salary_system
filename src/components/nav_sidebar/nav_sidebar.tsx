import { usePathname } from "next/navigation";
import { type HTMLAttributes } from "react";
import { api } from "~/utils/api";
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
import { type AccessiblePagesType } from "~/server/api/types/access_page_type";

function navLinks(
	data: AccessiblePagesType
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
	const { isSuccess, data } = api.access.accessByRole.useQuery(); // isError, error

	const { t } = useTranslation(["nav", "common"]);

	if (!isSuccess) {
		return <></>;
	}

	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader>
				<SidebarPeriodSelector />
			</SidebarHeader>
			<SidebarContent>
				{/* Action */}
				<SidebarGroupLinks
					groupTitle={t("actions")}
					navLinks={navLinks(data).action}
					currentPath={pathname}
				/>
				{/* Setting */}
				<SidebarGroupLinks
					groupTitle={t("configurations")}
					navLinks={navLinks(data).setting}
					currentPath={pathname}
				/>
				{/* Test */}
				<SidebarGroupLinks
					groupTitle={t("configurations")}
					navLinks={navLinks(data).test}
					currentPath={pathname}
				/>
				{/* */}
			</SidebarContent>
			<SidebarFooter></SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
