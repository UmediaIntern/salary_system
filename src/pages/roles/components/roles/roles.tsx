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
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "~/components/ui/form";
import { Switch } from "~/components/ui/switch";
import { useEffect, useState } from "react";
import { Separator } from "~/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { CreateRoleDialog } from "./create_role_dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accessiblePages } from "~/server/api/types/access_page_type";
import { z } from "zod";
import { onPromise } from "~/utils/on_promise";

const accessiblePagesFormSchema = accessiblePages;
export function Roles() {
	const allRoles = api.access.getAllAccess.useQuery();
	const { isPending, content, data } = useQueryHandle(allRoles);
	const [selectedRole, setSelectedRole] = useState<z.infer<
		typeof accessiblePagesFormSchema
	> | null>(null);

	const form = useForm<z.infer<typeof accessiblePagesFormSchema>>({
		resolver: zodResolver(accessiblePagesFormSchema),
		defaultValues: selectedRole ?? {},
	});

	useEffect(() => {
		if (data?.[0]) {
			setSelectedRole(data[0]);
		}
	}, [data]);

	const onSubmit = (values: z.infer<typeof accessiblePagesFormSchema>) => {
		console.log("Submitted values:", values);
		// Add your save logic here
	};

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
					<Form {...form}>
						<form
							onSubmit={onPromise<void>(
								form.handleSubmit(onSubmit)
							)}
							className="w-full space-y-6"
						>
							<div>
								<h3 className="mb-4 text-2xl font-bold">
									Pages
								</h3>
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="functions"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
												<div className="space-y-0.5">
													<FormLabel>
														Marketing emails
													</FormLabel>
													<FormDescription>
														Receive emails about new
														products, features, and
														more.
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={
															field.onChange
														}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
							</div>
							<div className="flex w-full flex-row justify-end">
								<Button className="ml-auto">
									<Save />
									Save
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
