import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	useEffect,
	useContext,
	type PropsWithChildren,
	type ReactElement,
	type HTMLAttributes,
} from "react";
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
} from "lucide-react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { Separator } from "~/components/ui/separator";
import { Dialog, DialogContent } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import periodContext from "./context/period_context";
import PeriodSelector from "./period_selector";
import { useTranslation } from "react-i18next";
import { useComponentSize } from "~/lib/utils/size_hook";

export type Playlist = (typeof playlists)[number];

export const playlists = [
	"Total expense",
	"Employee",
	"History",
	"Table 1",
	"Table 2",
	"Table 3",
	"Table 4",
	"Table 5",
];

type NavLinkProp = {
	navLinkEntry: NavLinkEntry;
	currentPath: string;
	collapsed: boolean;
	collapseFunction: () => void;
	expandFunction: () => void;
};

function CompNavLinkWrap(props: PropsWithChildren<NavLinkProp>) {
	return props.collapsed ? (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="flex w-full items-center justify-center">
						<Link
							key={props.navLinkEntry.url}
							href={props.navLinkEntry.url}
							className={cn(
								buttonVariants({ variant: "ghost" }),
								props.currentPath === props.navLinkEntry.url &&
									"bg-muted hover:bg-muted"
							)}
						>
							<props.navLinkEntry.icon className="h-4 w-4" />
							<TooltipContent>{props.children}</TooltipContent>
						</Link>
					</div>
				</TooltipTrigger>
			</Tooltip>
		</TooltipProvider>
	) : (
		<Link
			key={props.navLinkEntry.url}
			href={props.navLinkEntry.url}
			onClick={() => {
				if (props.navLinkEntry.collapsed) {
					props.collapseFunction();
				}
			}}
			className={cn(
				buttonVariants({ variant: "ghost" }),
				props.currentPath === props.navLinkEntry.url &&
					"bg-muted hover:bg-muted",
				"w-full justify-start"
			)}
		>
			<div className="flex items-center">
				<props.navLinkEntry.icon className="h-4 w-4 flex-shrink-0" />
				<div className="line-clamp-1 break-all ps-2">
					{props.children}
				</div>
			</div>
		</Link>
	);
}

type SelectItemProp = {
	selectItemEntry: SelectItemEntry;
	collapsed: boolean;
	collapseFunction: () => void;
	expandFunction: () => void;
};

function CompSelectItemWrap(props: PropsWithChildren<SelectItemProp>) {
	const { selectedPeriod, selectedPayDate } = useContext(periodContext);
	const { t } = useTranslation(["common"]);

	return props.collapsed ? (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Dialog>
						<div className="flex w-full items-center justify-center">
							<DialogTrigger
								className={cn(
									buttonVariants({ variant: "ghost" })
								)}
							>
								<props.selectItemEntry.icon className="h-4 w-4" />
								<TooltipContent>
									{props.children}
								</TooltipContent>
							</DialogTrigger>
						</div>

						<DialogContent>
							{props.selectItemEntry.popUpPage}
						</DialogContent>
					</Dialog>
				</TooltipTrigger>
			</Tooltip>
		</TooltipProvider>
	) : (
		<Dialog>
			<DialogTrigger
				className={cn(
					buttonVariants({ variant: "ghost" }),
					"w-full justify-start"
				)}
			>
				<div className="flex w-full items-center">
					<props.selectItemEntry.icon className="h-4 w-4 flex-shrink-0" />
					<div className="flex w-full justify-between ps-2">
						<div className="line-clamp-1 break-all">
							{props.children}
						</div>
						<div className="line-clamp-1 break-all">
							{selectedPeriod?.period_name && selectedPayDate
								? selectedPayDate
								: t("others.not_set")}
						</div>
					</div>
				</div>
			</DialogTrigger>
			<DialogContent>{props.selectItemEntry.popUpPage}</DialogContent>
		</Dialog>
	);
}

interface SidebarProp extends HTMLAttributes<HTMLDivElement> {
	isCollapsed: boolean;
	collapseFunction: () => void;
	expandFunction: () => void;
}

type NavLinkEntry = {
	title: string;
	icon: LucideIcon;
	url: string;
	collapsed: boolean;
};

type SelectItemEntry = {
	title: string;
	icon: LucideIcon;
	popUpPage: ReactElement;
};

// Nav link configurations

const selectItems: SelectItemEntry[] = [
	{
		title: "period",
		icon: FlagTriangleRight,
		popUpPage: <PeriodSelector />,
	},
];

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

// https://www.flaticon.com/free-icon-font/coins_7928197?related_id=7928197
export function Sidebar({
	className,
	isCollapsed,
	collapseFunction,
	expandFunction,
}: SidebarProp) {
	const pathname = usePathname();
	const { isLoading, data } = api.access.accessByRole.useQuery(); // isError, error

	const { t } = useTranslation(["nav", "common"]);

	const { ref, width } = useComponentSize();

	useEffect(() => {
		if (width < 100) {
			collapseFunction();
		}
	});

	if (isLoading) {
		return <></>;
	}

	return (
		<div ref={ref} className={cn("pb-12", className)}>
			<div className="space-y-2 py-4">
				{/* Select */}
				<div className={cn("py-2", !isCollapsed && "px-3")}>
					{!isCollapsed && (
						<div className="mb-2 line-clamp-1 break-all px-4 text-lg font-semibold tracking-tight">
							{t("selects")}
						</div>
					)}
					<div className="space-y-1">
						{selectItems.map((item) => (
							<CompSelectItemWrap
								key={item.title}
								selectItemEntry={item}
								collapsed={isCollapsed}
								collapseFunction={collapseFunction}
								expandFunction={expandFunction}
							>
								{t("period")}
							</CompSelectItemWrap>
						))}
					</div>
				</div>
				{isCollapsed && <Separator />}
				{/* Action */}
				{data?.actions && (
					<div className={cn("py-2", !isCollapsed && "px-3")}>
						{!isCollapsed && (
							<div className="mb-2 line-clamp-1 break-all px-4 text-lg font-semibold tracking-tight">
								{t("actions")}
							</div>
						)}
						<div className="space-y-1">
							{actionLinks.map((link) => (
								<CompNavLinkWrap
									key={link.title}
									navLinkEntry={link}
									currentPath={pathname}
									collapsed={isCollapsed}
									collapseFunction={collapseFunction}
									expandFunction={expandFunction}
								>
									{t(link.title)}
								</CompNavLinkWrap>
							))}
						</div>
					</div>
				)}
				{isCollapsed && <Separator />}
				{/* Setting */}
				<div className={cn("py-2", !isCollapsed && "px-3")}>
					{!isCollapsed && (
						<div className="mb-2 line-clamp-1 break-all px-4 text-lg font-semibold tracking-tight">
							{t("configurations")}
						</div>
					)}
					<div className="space-y-1">
						{settingLinks.map((link) => (
							<CompNavLinkWrap
								key={link.title}
								navLinkEntry={link}
								currentPath={pathname}
								collapsed={isCollapsed}
								collapseFunction={collapseFunction}
								expandFunction={expandFunction}
							>
								{t(link.title)}
							</CompNavLinkWrap>
						))}
					</div>
				</div>
				{/* Test */}
				<div className={cn("py-2", !isCollapsed && "px-3")}>
					{!isCollapsed && (
						<div className="mb-2 line-clamp-1 break-all px-4 text-lg font-semibold tracking-tight">
							{t("configurations")}
						</div>
					)}
					<div className="space-y-1">
						{testLinks.map((link) => (
							<CompNavLinkWrap
								key={link.title}
								navLinkEntry={link}
								currentPath={pathname}
								collapsed={isCollapsed}
								collapseFunction={collapseFunction}
								expandFunction={expandFunction}
							>
								{t(link.title)}
							</CompNavLinkWrap>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
