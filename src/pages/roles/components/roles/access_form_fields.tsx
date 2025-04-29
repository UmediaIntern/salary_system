import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "~/components/ui/form";
import { Switch } from "~/components/ui/switch";
import { type Path, type UseFormReturn } from "react-hook-form";
import { type z } from "zod";
import { type PropsWithChildren } from "react";


interface FormSwitchFieldCompProps<T extends z.ZodType> {
	form: UseFormReturn<z.infer<T>>;
	name: Path<z.infer<T>>;
	disabled?: boolean;
}

export function FormSwitchFieldComp<T extends z.ZodType>({
	children,
	form,
	name,
	disabled = false,
}: PropsWithChildren<FormSwitchFieldCompProps<T>>) {
	return (
		<FormField
			key={name}
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-col rounded-lg border p-3 shadow-sm">
					<FormItemComp label={name}>
						<Switch
							disabled={disabled}
							checked={field.value === true}
							onCheckedChange={field.onChange}
						/>
					</FormItemComp>
					{field.value && children}
				</FormItem>
			)}
		/>
	);
}

function FormItemComp({
	label,
	children,
}: PropsWithChildren<{ label: string }>) {
	return (
		<div className="flex flex-row items-center justify-between">
			<FormDescComp label={label} />
			<FormControl>{children}</FormControl>
		</div>
	);
}

function FormDescComp({ label }: { label: string }) {
	return (
		<div className="space-y-0.5">
			<FormLabel>{label}</FormLabel>
			<FormDescription>
				Access the functions in the
				{label} page.
			</FormDescription>
		</div>
	);
}
