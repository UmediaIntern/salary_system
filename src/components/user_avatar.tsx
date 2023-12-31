import {
	CreditCard,
	LogOut,
	Settings,
	User,
  } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "~/components/ui/dialog";

import Link from "next/link";

export function UserAvatar() {
	const username = "shadcn"
	const userEmail = "m@example.com"
	return (
		<Dialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="relative h-8 w-8 rounded-full"
					>
						<Avatar className="h-8 w-8">
							<AvatarImage src="" alt="@shadcn" />
							<AvatarFallback>SC</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">
								{username}
							</p>
							<p className="text-xs leading-none text-muted-foreground">
								{userEmail}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={RouteProfile}>
							<User className="mr-2 h-4 w-4" />
							<span>Profile</span>
							<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<CreditCard className="mr-2 h-4 w-4" />
							<span>Billing</span>
							<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
							<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
						</DropdownMenuItem>
						{/* Add new MenuItems here */}
						{/* <DropdownMenuItem>New Team</DropdownMenuItem> */}
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DialogTrigger asChild>
						<DropdownMenuItem>
							<LogOut className="mr-2 h-4 w-4" />
							<span>Log Out</span>
							<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure to log out?</DialogTitle>
					<DialogDescription>
						You will need to login again once you logout.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Link key={"/login"} href={"/login"}>
						<Button type="submit" onClick={LogoutFunction}>
							Confirm
						</Button>
					</Link>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function LogoutFunction() {
	console.log("Implement log out function here");
}

function RouteProfile() {
	console.log("Route to profile page")
}