import { BellRing, Check } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { useQueryHandle } from "../query_boundary/query_handle";
import { api } from "~/utils/api";
import { useTranslation } from "react-i18next";

export function Notification() {
	const { t } = useTranslation(["common"]);
	const getNotification = api.notification.getNotifications.useQuery();
	const { data, isPending, content } = useQueryHandle(getNotification);

	return (
		<Card className="m-0">
			<CardHeader>
				<CardTitle>Notifications</CardTitle>
				{!isPending && (
					<CardDescription>
						You have {data.length} unread messages.
					</CardDescription>
				)}
			</CardHeader>
			<CardContent className="grid gap-4">
				<div className=" flex items-center space-x-4 rounded-md border p-4">
					<BellRing />
					<div className="flex-1 space-y-1">
						<p className="text-sm font-medium leading-none">
							Push Notifications
						</p>
						<p className="text-sm text-muted-foreground">
							Send notifications to device.
						</p>
					</div>
					<Switch />
				</div>
				{isPending ? (
					content
				) : (
					<div>
						{data.map((notification, index) => (
							<div
								key={index}
								className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
							>
								<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
								<div className="space-y-1">
									<p className="text-sm font-medium leading-none">
										{notification.title}
									</p>
									<p className="text-sm text-muted-foreground">
										{notification.description}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
			<CardFooter>
				<Button className="w-full">
					<Check /> Mark all as read
				</Button>
			</CardFooter>
		</Card>
	);
}
