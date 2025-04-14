import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { onPromise } from "~/utils/on_promise";

const createAccessFormSchema = z.object({
	role_name: z.string().nonempty("Role name is required"),
});
export function CreateRoleDialog() {
	const form = useForm<z.infer<typeof createAccessFormSchema>>({
		resolver: zodResolver(createAccessFormSchema),
		defaultValues: {
			role_name: "Role name",
		},
	});

	function onSubmit(values: z.infer<typeof createAccessFormSchema>) {
		console.log(values);
	}

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Create New Role</DialogTitle>
				<DialogDescription>Give the role a name.</DialogDescription>
			</DialogHeader>
			<div className="mx-2 mt-4">
				<Form {...form}>
					<form
						onSubmit={onPromise<void>(form.handleSubmit(onSubmit))}
						className="space-y-8"
					>
						<FormField
							control={form.control}
							name="role_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-base font-semibold">
										Role name
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Role name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex flex-row justify-end">
							<Button type="submit">Submit</Button>
						</div>
					</form>
				</Form>
			</div>
		</DialogContent>
	);
}
