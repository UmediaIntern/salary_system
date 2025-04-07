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

const navLinks: Record<"action" | "setting" | "test", NavLinkEntry[]> = {
	action: [
		{
			title: "functions",
			icon: LayoutGrid,
			url: "/functions",
			collapsed: false,
		},
		{
			title: "synchronize",
			icon: CheckSquare,
			url: "/synchronize",
			collapsed: false,
		},
		{
			title: "employees",
			icon: Contact,
			url: "/employees",
			collapsed: false,
		},
		{
			title: "parameters",
			icon: SlidersHorizontal,
			url: "/parameters",
			collapsed: false,
		},
		{
			title: "bonus",
			icon: CircleDollarSign,
			url: "/bonus",
			collapsed: false,
		},
		{
			title: "calendar",
			icon: CalendarRange,
			url: "/calendar",
			collapsed: false,
		},
	],

	setting: [
		{
			title: "settings",
			icon: Settings,
			url: "/settings",
			collapsed: false,
		},
		{
			title: "roles",
			icon: ShieldCheck,
			url: "/roles",
			collapsed: false,
		},
		{
			title: "reports",
			icon: GanttChartSquare,
			url: "/report",
			collapsed: false,
		},
	],
	test: [
		{
			title: "test transaction",
			icon: CircleDollarSign,
			url: "/test",
			collapsed: false,
		},
	],
} as const;

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
					navLinks={navLinks.action}
					currentPath={pathname}
				/>
				{/* Setting */}
				<SidebarGroupLinks
					groupTitle={t("configurations")}
					navLinks={navLinks.setting}
					currentPath={pathname}
				/>
				{/* Test */}
				<SidebarGroupLinks
					groupTitle={t("configurations")}
					navLinks={navLinks.test}
					currentPath={pathname}
				/>
				{/* */}
			</SidebarContent>
			<SidebarFooter></SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
