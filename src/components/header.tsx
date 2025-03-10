import type { PropsWithChildren } from "react";
import { Separator } from "~/components/ui/separator";
import { UserAvatar } from "~/components/user_avatar";
import { ThemeSelector } from "~/components/theme_selector";
import { useSession } from "next-auth/react";
import { LanguageSelector } from "./language_selector";
import { NotificationTrigger } from "./notification/notification_trigger";

interface TitleProp extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	showOptions?: boolean;
}

export const Header = (props: PropsWithChildren<TitleProp>) => {
	const { data: session, status } = useSession();

	return (
		<div className={props.className}>
			<div className="m-4 flex">
				<h2 className="text-2xl font-semibold tracking-tight">
					{props.title}
				</h2>
				{props.showOptions ? (
					<div className="align-bot ml-auto flex items-center space-x-1">
						<NotificationTrigger />
						<LanguageSelector />
						<ThemeSelector />
						{status === "authenticated" ? <UserAvatar /> : <></>}
					</div>
				) : (
					<></>
				)}
			</div>
			<Separator />
		</div>
	);
};
