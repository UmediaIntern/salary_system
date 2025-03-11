import { usePathname } from "next/navigation";
import Link from "next/link";
import { type PropsWithChildren, type HTMLAttributes } from "react";
import { api } from "~/utils/api";
import {
	GanttChartSquare,
	LayoutGrid,
	type LucideIcon,
	Settings,
	ShieldCheck,
	SlidersHorizontal,
	CheckSquare,
	CalendarRange,
	Contact,
	CircleDollarSign,
	FlagTriangleRight,
	ChevronsUpDown,
} from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import PeriodSelector from "./period_selector";
import { useTranslation } from "react-i18next";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "~/components/ui/sidebar";
import { usePeriodContext } from "./context/period_context_provider";

// type NavLinkProp = {
// 	navLinkEntry: NavLinkEntry;
// 	currentPath: string;
// 	collapsed: boolean;
// };
//
// function CompNavLinkWrap(props: PropsWithChildren<NavLinkProp>) {}
//
// type SelectItemProp = {
// 	selectItemEntry: SelectItemEntry;
// 	collapsed: boolean;
// 	collapseFunction: () => void;
// 	expandFunction: () => void;
// };
//
// function CompSelectItemWrap(props: PropsWithChildren<SelectItemProp>) {
// }


type NavLinkEntry = {
	title: string;
	icon: LucideIcon;
	url: string;
	collapsed: boolean;
};

const actionLinks: NavLinkEntry[] = [
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
];

const settingLinks: NavLinkEntry[] = [
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
];

const testLinks: NavLinkEntry[] = [
	{
		title: "test transaction",
		icon: CircleDollarSign,
		url: "/test",
		collapsed: false,
	},
];

interface NavSidebarProp extends HTMLAttributes<HTMLDivElement> {
	isCollapsed: boolean;
}
// https://www.flaticon.com/free-icon-font/coins_7928197?related_id=7928197
export function NavSidebar({
}: NavSidebarProp) {
	const pathname = usePathname();
	const { isLoading, data } = api.access.accessByRole.useQuery(); // isError, error

	const { t } = useTranslation(["nav", "common"]);

	const { selectedPeriod, selectedPayDate } = usePeriodContext();

	if (isLoading) {
		return <></>;
	}

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<Dialog>
							<DialogTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
										<FlagTriangleRight className="size-4" />
									</div>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{t("period")}
										</span>
										<span className="truncate text-xs">
											{selectedPeriod?.period_name &&
											selectedPayDate
												? selectedPayDate
												: t("others.not_set", {
														ns: "common",
												  })}
										</span>
									</div>
									<ChevronsUpDown className="ml-auto" />
								</SidebarMenuButton>
							</DialogTrigger>
							<DialogContent>
								<PeriodSelector />
							</DialogContent>
						</Dialog>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{/* Action */}
				<SidebarGroup>
					<SidebarGroupLabel>{t("actions")}</SidebarGroupLabel>
					<SidebarMenu>
						{actionLinks.map((link) => (
							<SidebarMenuItem key={link.title}>
								<SidebarMenuButton
									tooltip={t(link.title)}
									asChild
									isActive={pathname === link.url}
								>
									<Link
										key={link.url}
										href={link.url}
										onClick={() => {
											if (link.collapsed) {
												// props.collapseFunction();
											}
										}}
									>
										{link.icon && <link.icon />}
										<span>{t(link.title)}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
				{/* Setting */}
				<SidebarGroup>
					<SidebarGroupLabel>{t("configurations")}</SidebarGroupLabel>
					<SidebarMenu>
						{settingLinks.map((link) => (
							<SidebarMenuItem key={link.title}>
								<SidebarMenuButton tooltip={t(link.title)}>
									{link.icon && <link.icon />}
									<span>{t(link.title)}</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
				{/* Test */}
				<SidebarGroup>
					<SidebarGroupLabel>{t("configurations")}</SidebarGroupLabel>
					<SidebarMenu>
						{testLinks.map((link) => (
							<SidebarMenuItem key={link.title}>
								<SidebarMenuButton tooltip={t(link.title)}>
									{link.icon && <link.icon />}
									<span>{t(link.title)}</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
				{/* */}
			</SidebarContent>
			<SidebarFooter></SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
