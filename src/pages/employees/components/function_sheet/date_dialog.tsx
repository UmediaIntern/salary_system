import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { DatePicker } from "~/components/ui/date-picker";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, Form } from "~/components/ui/form";

interface DateDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onSubmit: (date: Date) => void;
}

const dateDialogSchema = z.object({
	date: z.date(),
});

// TODO: validate date is valid (disable invalid value)
export function DateDialog({
	open,
	setOpen,
	onSubmit: submit,
}: DateDialogProps) {
	const form = useForm<z.infer<typeof dateDialogSchema>>({
		resolver: zodResolver(dateDialogSchema),
		defaultValues: {
			date: new Date(),
		},
	});

	const onSubmit = (data: z.infer<typeof dateDialogSchema>) => {
    submit(data.date);
  };

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently
						delete your account and remove your data from our
						servers.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={(event) =>
							void form.handleSubmit(onSubmit)(event)
						}
					>
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<DatePicker
									date={field.value}
									setDate={field.onChange}
								/>
							)}
						/>
					</form>
				</Form>
				<DialogFooter>
					<Button type="submit">Confirm</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
