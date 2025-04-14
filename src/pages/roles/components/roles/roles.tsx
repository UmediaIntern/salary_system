import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { CircleFadingPlus, Save } from "lucide-react";
import { api } from "~/utils/api";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
} from "~/components/ui/form";
import { Switch } from "~/components/ui/switch";
import { useState } from "react";
import { Separator } from "~/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { CreateRoleDialog } from "./create_role_dialog";

export function Roles() {
	const allRoles = api.access.getAllAccess.useQuery();
	const { isPending, content, data } = useQueryHandle(allRoles);
	const [selectedRole, setSelectedRole] = useState<string | null>(null);

	return (
		<div className="flex h-full flex-row gap-x-4">
			<Card className="h-full w-1/5">
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
				<CardContent>
					{isPending
						? content
						: data.map((access) => (
								<div key={access.id}>{access.role}</div>
						  ))}
				</CardContent>
			</Card>
			<div className="h-full grow">
				<div className="flex flex-col gap-y-4">
					<Card className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
						<div className="space-y-0.5">
							<CardTitle className="text-lg">
								Marketing emails
							</CardTitle>
							<CardDescription>
								Receive emails about new products, features, and
								more.
							</CardDescription>
						</div>
						<Switch />
					</Card>

					<Card className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
						<div className="space-y-0.5">
							<CardTitle className="text-lg">
								Marketing emails
							</CardTitle>
							<CardDescription>
								Receive emails about new products, features, and
								more.
							</CardDescription>
						</div>
						<Switch />
					</Card>

					<Card className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
						<div className="space-y-0.5">
							<CardTitle className="text-lg">
								Marketing emails
							</CardTitle>
							<CardDescription>
								Receive emails about new products, features, and
								more.
							</CardDescription>
						</div>
						<Switch />
					</Card>

					<div className="flex w-full flex-row justify-end">
						<Button className="ml-auto">
							<Save />
							Save
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
