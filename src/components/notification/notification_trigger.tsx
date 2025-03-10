import * as React from "react";
import { Globe } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { Notification } from "./notification";

export function NotificationTrigger() {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon">
					<Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Globe className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Notifications</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent asChild className="p-0 border-none shadow-none">
				<div className="min-w-[500px] mx-4">
					<Notification />
				</div>
			</PopoverContent>
		</Popover>
	);
}
