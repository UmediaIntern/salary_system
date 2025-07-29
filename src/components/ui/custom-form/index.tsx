"use client";

import { type ReactNode } from "react";
import { type z } from "zod";
import { Form } from "../form";

import { Button } from "../button";
import { cn } from "~/lib/utils";

import { type ZodObjectOrWrapped } from "./utils";
import { createFormEntries, parseSchema } from "./parser";
import { CustomFormField } from "./field";
import { type CustomFormProps } from "./types";

export function CustomFormSubmit({ children }: { children?: ReactNode }) {
	return <Button type="submit">{children ?? "Submit"}</Button>;
}

export default function CustomForm<SchemaType extends ZodObjectOrWrapped>({
	formSchema,
	form,
	formConfig,
	onValuesChange: onValuesChangeProp,
	onParsedValuesChange,
	onSubmit: onSubmitProp,
	children,
	className,
	formId,
}: CustomFormProps<SchemaType>) {
	// NOTE: parse form schema and handle field config
	const parsedSchema = parseSchema(formSchema);
	const formEntries = createFormEntries(parsedSchema, formConfig)

	function onSubmit(data: z.infer<typeof formSchema>) {
		const parsedValues = formSchema.safeParse(data);
		if (!parsedValues.success) {
			console.log("Parse value failed", parsedValues.error.message)
		}
		if (parsedValues.success) {
			onSubmitProp?.(parsedValues.data);
		}
	}

	return (
		<Form {...form}>
			<form
				id={formId}
				onSubmit={form.handleSubmit(onSubmit)}
				onChange={() => {
					const values = form.getValues();
					onValuesChangeProp?.(values);
					const parsedValues = formSchema.safeParse(values);
					if (parsedValues.success) {
						onParsedValuesChange?.(parsedValues.data);
					}
				}}
				className={cn("space-y-5 p-2", className)}
			>
				{formEntries.entries.map((entry) => {
					const field = entry.field
          const config = entry.config;

					return !config?.hidden && <CustomFormField
						key={field.key}
						field={field}
						path={[field.key]}
						render={config?.render}
						fixed={config?.fixed}
					/>
				})}
				{children}
			</form>
		</Form>
	);
}
