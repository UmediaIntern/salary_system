import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { api } from "~/utils/api";
import {
	CalendarRange,
	GanttChartSquare,
	LayoutGrid,
	LucideIcon,
	Settings,
	ShieldCheck,
	SlidersHorizontal,
	CheckSquare,
} from "lucide-react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { Separator } from "~/components/ui/separator";

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
					<Link
						key={props.navLinkEntry.url}
						href={props.navLinkEntry.url}
						onClick={() => {
							if (!props.navLinkEntry.collapsed) {
								props.expandFunction();
							}
						}}
						className={cn(
							buttonVariants({ variant: "ghost" }),
							props.currentPath === props.navLinkEntry.url &&
								"bg-muted hover:bg-muted",
							"w-full justify-center items-center"
						)}
					>
						<props.navLinkEntry.icon className="h-4 w-4" />
						<TooltipContent>{props.children}</TooltipContent>
					</Link>
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

interface SidebarProp extends React.HTMLAttributes<HTMLDivElement> {
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

const actionLinks: NavLinkEntry[] = [
	{
		title: "Functions",
		icon: LayoutGrid,
		url: "/functions",
		collapsed: false,
	},
	{
		title: "Parameters",
		icon: SlidersHorizontal,
		url: "/parameters",
		collapsed: true,
	},
	{
		title: "Synchronize",
		icon: CheckSquare,
		url: "/check",
		collapsed: false,
	},
];

const settingLinks: NavLinkEntry[] = [
	{
		title: "Settings",
		icon: Settings,
		url: "/settings",
		collapsed: false,
	},
	{
		title: "Roles",
		icon: ShieldCheck,
		url: "/roles",
		collapsed: false,
	},
	{
		title: "Report",
		icon: GanttChartSquare,
		url: "/report",
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

	const { isLoading, isError, data, error } =
		api.access.accessByRole.useQuery();

	if (isLoading) {
		return <></>;
	}

	return (
		<div className={cn("pb-12", className)}>
			<div className="space-y-2 py-4">
				{data?.actions && (
					<div className={cn("py-2", !isCollapsed && "px-3")}>
						{!isCollapsed && (
							<div className="mb-2 line-clamp-1 break-all px-4 text-lg font-semibold tracking-tight">
								Actions
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
									{link.title}
								</CompNavLinkWrap>
							))}
						</div>
					</div>
				)}
				{isCollapsed && <Separator />}
				<div className={cn("py-2", !isCollapsed && "px-3")}>
					{!isCollapsed && (
						<div className="mb-2 line-clamp-1 break-all px-4 text-lg font-semibold tracking-tight">
							Configurations
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
								{link.title}
							</CompNavLinkWrap>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
