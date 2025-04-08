import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "~/components/ui/sidebar";

export type NavLinkEntry = {
	title: string;
	icon: LucideIcon;
	url: string;
	collapsed: boolean;
	accessible: boolean;
};

interface SidebarGroupLinksProp {
	groupTitle: string;
	navLinks: NavLinkEntry[];
	currentPath: string;
}

export function SidebarGroupLinks({
	groupTitle,
	navLinks,
	currentPath,
}: SidebarGroupLinksProp) {
	const { t } = useTranslation(["nav"]);

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{groupTitle}</SidebarGroupLabel>
			<SidebarMenu>
				{navLinks.map(
					(link) =>
						link.accessible && (
							<SidebarMenuItem key={link.title}>
								<SidebarMenuButton
									tooltip={t(link.title)}
									asChild
									isActive={currentPath === link.url}
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
						)
				)}
			</SidebarMenu>
		</SidebarGroup>
	);
}
