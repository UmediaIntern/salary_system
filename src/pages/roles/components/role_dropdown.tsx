import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { ChevronDownIcon } from "lucide-react";

type IdentityType = {
    identity: string;
    description: string;
};

export function RoleDropdown() {
	const identitylist: IdentityType[] = [
		{
			identity: "Viewer",
			description: "Can view and comment.",
		},
		{
			identity: "Developer",
			description: "Can view, comment and edit.",
		},
		{
			identity: "Billing",
			description: "Can view, comment and manage billing.",
		},
		{
			identity: "Owner",
			description: "Admin-level access to all resources.",
		},
	];
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" className="ml-auto">
					Owner{" "}
					<ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0" align="end">
				<Command>
					<CommandInput placeholder="Select new role..." />
					<CommandList>
						<CommandEmpty>No roles found.</CommandEmpty>
						<CommandGroup>
							{identitylist.map((props: IdentityType) => (
								<CommandItem
									key={props.identity}
									className="teamaspace-y-1 flex flex-col items-start px-4 py-2"
								>
									<p>{props.identity}</p>
									<p className="text-sm text-muted-foreground">
										{props.description}
									</p>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
