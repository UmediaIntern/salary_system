import { type z } from "zod";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import CustomForm from "~/components/ui/custom-form";
import { type FormConfig } from "~/components/ui/custom-form/types";
import GeneralTable from "~/components/table_functions/general_table";
import { ScrollArea } from "~/components/ui/scroll-area";

export interface StandardFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	formConfig?: FormConfig<SchemaType>;
	formSubmit?: (data: z.infer<SchemaType>) => void;
	defaultValue?: DefaultValues<z.infer<SchemaType>>;
	buttonText: string;
	closeSheet: () => void;
}

export const buildStandardFormProps = <T extends z.AnyZodObject>(
	props: StandardFormProps<T>
): StandardFormProps<T> => {
	return props;
};

export function StandardForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	formConfig,
	formSubmit,
	defaultValue,
	buttonText,
	closeSheet,
}: StandardFormProps<SchemaType>) {
	const formId = "standard_form";
	const { t } = useTranslation(["common"]);
	const [openDialog, setOpenDialog] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValue,
	});
	const [formValues, setFormValues] = useState<
		z.infer<SchemaType> | Record<string, any>
	>({});
	// TODO: parse with schema
	const { id, ...displayData } = formValues;

	return (
		<>
			<CustomForm
				formSchema={formSchema}
				formConfig={formConfig}
				form={form}
				onSubmit={(v) => {
					formSubmit?.(v);
				}}
				formId={formId}
			>
				<div className="flex w-full justify-end gap-4 py-4">
					<Button
						type="button"
						variant={"outline"}
						onClick={() => {
							closeSheet();
						}}
					>
						{t("button.cancel")}
					</Button>

					{/* TODO: handle form submit validation */}
					<Button
						type="button"
						variant={"outline"}
						onClick={() => {
							setOpenDialog(true);
							const values = form.getValues();
							const parsedValues = formSchema.safeParse(values);
							if (parsedValues.success) {
								setFormValues(parsedValues.data);
							} else {
								console.log(
									"Parse value failed",
									parsedValues.error.message
								);
							}
						}}
					>
						{t(`button.${buttonText}`)}
					</Button>
				</div>
			</CustomForm>

			<Dialog
				open={openDialog}
				onOpenChange={setOpenDialog}
				aria-hidden={false}
			>
				<DialogContent className="p-0 sm:max-w-[425px]">
					<ScrollArea className="max-h-[80vh] w-full">
						<div className="p-12">
							<DialogHeader className="pb-12">
								<DialogTitle>
									{t("others.check_data")}
								</DialogTitle>
							</DialogHeader>
							<GeneralTable data={displayData} />
							<DialogFooter className="pt-12">
								<DialogClose asChild>
									<Button
										disabled={form.formState.isSubmitting}
										type="submit"
										form={formId}
									>
										{t("button.save")}
									</Button>
								</DialogClose>
							</DialogFooter>
						</div>
					</ScrollArea>
				</DialogContent>
			</Dialog>
		</>
	);
}
