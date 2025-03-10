import * as React from "react";
import { BellRing, Globe } from "lucide-react";
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
					<BellRing className="h-[1.2rem] w-[1.2rem] stroke-2" />
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
