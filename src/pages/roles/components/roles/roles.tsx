import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { CircleFadingPlus } from "lucide-react";
import { api } from "~/utils/api";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import { useEffect, useState } from "react";
import { Separator } from "~/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { CreateRoleDialog } from "./create_role_dialog";
import { cn } from "~/lib/utils";
import { ScrollArea } from "~/components/ui/scroll-area";
import { AccessForm } from "./access_form";
import { type AccessFEType } from "~/server/api/types/access_page_type";

export function Roles() {
	const allRoles = api.access.getAllAccess.useQuery();
	const { isPending, content, data } = useQueryHandle(allRoles);

	const [selectedRole, setSelectedRole] = useState<AccessFEType | null>(null);

	useEffect(() => {
		if (!selectedRole && data?.[0]) {
			setSelectedRole(data[0]);
		}

		if (selectedRole && data) {
			const selected = data.find((role) => role.id === selectedRole.id);
			if (selected) {
				setSelectedRole(selected);
			} else {
				data[0] && setSelectedRole(data[0]);
			}
		}
	}, [data, selectedRole]);

	return (
		<div className="flex h-full flex-row gap-x-4">
			<Card className="h-full w-1/5 min-w-[300px]">
				<div className="flex flex-row items-center p-4">
					<CardHeader className="p-0">
						<CardTitle>Roles</CardTitle>
						<CardDescription>Roles access</CardDescription>
					</CardHeader>
					<Dialog>
						<DialogTrigger asChild>
							<Button className="ml-auto">
								<CircleFadingPlus />
								Create
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<CreateRoleDialog />
						</DialogContent>
					</Dialog>
				</div>

				<Separator />
				<CardContent className="flex flex-col gap-y-2 p-4">
					{isPending
						? content
						: data.map((access) => (
								<div
									className={cn(
										"w-full rounded-md border p-4",
										access.role === selectedRole?.role &&
											"bg-secondary"
									)}
									key={access.id}
									onClick={() => setSelectedRole(access)}
								>
									{access.role}
								</div>
						  ))}
				</CardContent>
			</Card>
			<div className="grow">
				<ScrollArea className="h-full pr-4">
					{selectedRole && <AccessForm selectedRole={selectedRole} />}
					{/* TODO: Delete role */}
				</ScrollArea>
			</div>
		</div>
	);
}
