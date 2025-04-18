import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";
import { CalendarDays } from "lucide-react";

type EmployeeInfo = {
	username: string;
	userEmail: string;
	description: string;
	avatarImgSource: string;
};

const capitalizeFirstLetter = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export function CurrentUserCard() {
	const { data: session, status } = useSession();

	const info: EmployeeInfo = {
		username: capitalizeFirstLetter(
			session?.user.emp_no ?? "Something went wrong"
		),
		userEmail: session?.user.email ?? "Email not set yet",
		description: "balabalabalabala balabalabala balabala",
		avatarImgSource: "https://github.com/shadcn.png",
	};

	return (
		<>
			<Card className="">
				<CardHeader>
					<CardTitle>Administrator</CardTitle>
					<CardDescription>
						Modify the access rights for the employees.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-6">
					<div className="flex items-center justify-between space-x-4">
						<div className="flex items-center space-x-4">
							<Avatar>
								<AvatarImage src={info.avatarImgSource} />
								<AvatarFallback>
									{info.username
										.split(" ")
										.map((eachWord: string) => {
											return eachWord[0];
										})
										.join("")}
								</AvatarFallback>
							</Avatar>
							<div>
								<CompHoverCard info={info} />
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
}

function CompHoverCard({ info }: { info: EmployeeInfo }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<div>
					<p className="text-sm font-medium leading-none">
						{info.username}
					</p>
					<p className="text-sm text-muted-foreground">
						{info.userEmail}
					</p>
				</div>
			</HoverCardTrigger>
			<HoverCardContent className="w-80">
				<div className="flex justify-between space-x-4">
					<Avatar>
						<AvatarImage src={info.avatarImgSource} />
						<AvatarFallback>
							{info.username
								.split(" ")
								.map((eachWord: string) => {
									return eachWord[0];
								})
								.join("")}
						</AvatarFallback>
					</Avatar>
					<div className="space-y-1">
						<h4 className="text-sm font-semibold">
							{info.username}
						</h4>
						<p className="text-sm">{info.description}</p>
						<div className="flex items-center pt-2">
							<CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
							<span className="text-xs text-muted-foreground">
								Joined December 2021
							</span>
						</div>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
