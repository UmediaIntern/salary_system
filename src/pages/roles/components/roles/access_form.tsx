import { Save, Trash } from "lucide-react";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { onPromise } from "~/utils/on_promise";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type AccessFEType,
	updateAccessAPI,
} from "~/server/api/types/access_page_type";
import { type z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { useToast } from "~/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useRoleCommandContext } from "../role_command_context";
import { FormSwitchFieldComp } from "./access_form_fields";
import { useExitWarning } from "~/components/hooks/use_exit_warning";

const accessiblePagesFormSchema = updateAccessAPI;
const fieldKey = accessiblePagesFormSchema.keyof();

export function AccessForm({ selectedRole }: { selectedRole: AccessFEType }) {
	const form = useForm<z.infer<typeof accessiblePagesFormSchema>>({
		resolver: zodResolver(accessiblePagesFormSchema),
	});

	const { reset, watch } = form;
	const [isChange, setIsChange] = useState(false);
	const { setSelectedTab } = useRoleCommandContext();
	const { toast } = useToast();

	const ctx = api.useUtils();
	const updateAccess = api.access.updateAccess.useMutation({
		onSuccess: () => {
			void ctx.access.invalidate();
		},
	});

	const deleteAccess = api.access.deleteAccess.useMutation({
		onError: (error) => {
			if (error.message.includes("user is connected")) {
				toast({
					title: "You cannot delete this role",
					description: "Some user is connected to this role",
					action: (
						<ToastAction altText="Goto acccounts page to unlink">
							<Button
								variant="outline"
								onClick={() => setSelectedTab("accounts")}
							>
								Accounts
							</Button>
						</ToastAction>
					),
				});
			}
		},
		onSuccess: () => {
			void ctx.access.invalidate();
		},
	});

	useEffect(() => {
		reset(selectedRole);
	}, [reset, selectedRole]);

	useEffect(() => {
		const { unsubscribe } = watch((value) => {
			let change = false;
			Object.entries(value).forEach(([key, value]) => {
				if (selectedRole?.hasOwnProperty(key)) {
					if (
						selectedRole[
							key as z.infer<typeof fieldKey>
						].toString() !== value.toString()
					) {
						change = true;
					}
				}
			});
			setIsChange(change);
		});
		return () => unsubscribe();
	}, [selectedRole, watch]);

  useExitWarning(isChange);

	const onSubmit = (values: z.infer<typeof accessiblePagesFormSchema>) => {
		console.log("Submitted values:", values);
		setIsChange(false);
		updateAccess.mutate(values);
	};

	const onDelete = () => {
		deleteAccess.mutate({ role_id: selectedRole.id });
	};

	return (
		<Form {...form}>
			<form
				onSubmit={onPromise<void>(form.handleSubmit(onSubmit))}
				className="w-full space-y-6"
			>
				<div>
					<h3 className="mb-4 text-2xl font-bold">Pages</h3>
					<div className="space-y-4">
						<FormSwitchFieldComp form={form} name="functions" />
						<FormSwitchFieldComp form={form} name="synchronize" />

						<FormSwitchFieldComp form={form} name="employees">
							<FormSwitchFieldComp
								form={form}
								name="employees_write"
							/>
							<FormField
								key={"employees_r_lv"}
								control={form.control}
								name={"employees_r_lv"}
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
										<div className="min-w-[300px] space-y-0.5">
											<FormLabel>
												Employee Read Level
											</FormLabel>
											<FormDescription>
												You can view employee under this
												level
											</FormDescription>
										</div>
										<FormControl>
											<Input
												className="max-w-[100px]"
												placeholder="shadcn"
												type="number"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</FormSwitchFieldComp>

						<FormSwitchFieldComp form={form} name="parameters">
							<FormSwitchFieldComp
								form={form}
								name="parameters_write"
							/>
						</FormSwitchFieldComp>

						<FormSwitchFieldComp form={form} name="bonus" />

						<FormSwitchFieldComp form={form} name="calendar">
							<FormSwitchFieldComp
								form={form}
								name="calendar_write"
							/>
						</FormSwitchFieldComp>

						<FormSwitchFieldComp
							disabled
							form={form}
							name="settings"
						/>
						<FormSwitchFieldComp
							form={form}
							name="roles"
							disabled={selectedRole.is_admin}
						/>
						<FormSwitchFieldComp form={form} name="report" />
					</div>
				</div>
				<div className="flex w-full flex-row justify-between">
					<Button
						onClick={onDelete}
						variant="destructive"
						disabled={selectedRole.is_admin}
					>
						<Trash />
						Delete
					</Button>
					<Button type="submit" disabled={!isChange}>
						<Save />
						Save
					</Button>
				</div>
			</form>
		</Form>
	);
}

