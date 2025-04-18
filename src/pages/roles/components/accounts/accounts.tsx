import { CalendarDays } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "~/components/ui/command";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";
import { useQueryHandle } from "~/components/query_boundary/query_handle";

type EmployeeInfo = {
	username: string;
	role: string;
	// userEmail?: string;
	// description?: string;
	// avatarImgSource?: string;
};

export function Accounts() {
	const { t } = useTranslation(["common"]);
	const getAllUsers = api.user.getAllUser.useQuery();
	const { isPending, content, data } = useQueryHandle(getAllUsers);

	if (isPending) {
		return content;
	}

	return (
		<div className="rounded-md border">
			<Command
				filter={(value, search) => {
					value = value.toLowerCase();
					search = search.toLowerCase();
					if (value.includes(search)) return 1;
					return 0;
				}}
			>
				<CommandInput placeholder="Search an employee" />
				<CommandList>
					<CommandEmpty>{t("table.no_data")}</CommandEmpty>
					<CommandGroup heading="Employees">
						<CommandItem value="-" className="hidden" />
						{data.map((emp) => {
							const empInfo: EmployeeInfo = {
								username: emp.emp_no,
								role: emp.access.role,
							};
							return (
								<CommandItem
									key={emp.emp_no}
									className={
										"teamaspace-y-1 flex flex-row items-center justify-between px-4 py-2"
									}
								>
									<UserItemComp info={empInfo} />
									<SelectRole info={empInfo} />
								</CommandItem>
							);
						})}
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	);
}

function SelectRole({ info }: { info: EmployeeInfo }) {
	const allRoles = api.access.getAllAccess.useQuery();
	const { isPending, content, data } = useQueryHandle(allRoles);

	const onValueChange = (value: string) => {
		console.log("Selected value:", value);
	};

	return (
		<Select defaultValue={info.role} onValueChange={onValueChange}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select a Role" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Access</SelectLabel>
					{isPending
						? content
						: data.map((role) => {
								return (
									<SelectItem
										key={role.id}
										value={role.role}
										className="cursor-pointer"
										title={role.role}
									>
										{role.role}
									</SelectItem>
								);
						  })}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

function UserItemComp({ info }: { info: EmployeeInfo }) {
	const avatarImgSource = "https://github.com/shadcn.png";
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<div className="flex items-center justify-start space-x-4">
					<Avatar>
						<AvatarImage src={avatarImgSource} />
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
						<p className="text-sm font-medium leading-none">
							{info.username}
						</p>
						<p className="text-sm text-muted-foreground">
							{info.role}
						</p>
					</div>
				</div>
			</HoverCardTrigger>
			<HoverCardContent className="h-full w-full" side="bottom">
				<div className="flex justify-between space-x-4">
					<Avatar>
						<AvatarImage src={avatarImgSource} />
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
							{info.username + " (" + info.role + ")"}
						</h4>
						<p className="text-sm">{"Description"}</p>
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
