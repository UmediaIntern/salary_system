import type { PropsWithChildren } from "react";
import { Separator } from "~/components/ui/separator";
import { UserAvatar } from "~/components/user_avatar";
import { ThemeSelector } from "~/components/theme_selector";
import { useSession } from "next-auth/react";
import { LanguageSelector } from "./language_selector";
import { NotificationTrigger } from "./notification/notification_trigger";
import { SidebarTrigger } from "./ui/sidebar";
import { cn } from "~/lib/utils";

interface TitleProp extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	showOptions?: boolean;
}

export const Header = ({
	title,
	showOptions,
	className,
}: PropsWithChildren<TitleProp>) => {
	const { status } = useSession();

	return (
		<div className={cn("px-2", className)}>
			<div className="flex h-12  shrink-0 flex-row items-center gap-2">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<h2 className="text-lg font-semibold tracking-tight">
					{title}
				</h2>
				{showOptions && (
					<div className="ml-auto flex items-center space-x-1">
						<NotificationTrigger />
						<LanguageSelector />
						<ThemeSelector />
						{status === "authenticated" ? <UserAvatar /> : <></>}
					</div>
				)}
				{/* <Breadcrumb> */}
				{/*   <BreadcrumbList> */}
				{/*     <BreadcrumbItem className="hidden md:block"> */}
				{/*       <BreadcrumbLink href="#"> */}
				{/*         Building Your Application */}
				{/*       </BreadcrumbLink> */}
				{/*     </BreadcrumbItem> */}
				{/*     <BreadcrumbSeparator className="hidden md:block" /> */}
				{/*     <BreadcrumbItem> */}
				{/*       <BreadcrumbPage>Data Fetching</BreadcrumbPage> */}
				{/*     </BreadcrumbItem> */}
				{/*   </BreadcrumbList> */}
				{/* </Breadcrumb> */}
			</div>
			<Separator />
		</div>
		//
	);
};
