import * as z from "zod";
import { Button } from "~/components/ui/button";
import { useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTrigger,
	DialogTitle,
	DialogClose,
	DialogFooter,
} from "~/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "~/components/ui/alert-dialog";

import { useContext } from "react";
import BonusToolbarFunctionsProvider, {
	bonusToolbarFunctionsContext,
} from "../components/function_sheet/bonus_functions_context";
import { type FieldConfig } from "~/components/ui/auto-form/types";
import { type BonusTableEnum } from "../bonus_tables";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import GeneralTable from "~/components/table_functions/general_table";

interface ParameterFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	fieldConfig?: FieldConfig<z.infer<SchemaType>>;
	onClose: () => void;
}

function EmptyCreateForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	fieldConfig,
	onClose,
}: ParameterFormProps<SchemaType>) {
	const mode = "create";
	const functions = useContext(bonusToolbarFunctionsContext);

	const createFunction = functions.createFunction!;

	const [formValues, setFormValues] = useState<
		Partial<z.infer<z.AnyZodObject>>
	>(getDefaults(formSchema));

	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [openForm, setOpenForm] = useState(false);
	const { t } = useTranslation(["common"]);

	function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
		return Object.fromEntries(
			Object.entries(schema.shape as Record<string, unknown>).map(
				([key, value]) => {
					if (value instanceof z.ZodDefault)
						return [key, value._def.defaultValue()];
					return [key, undefined];
				}
			)
		);
	}

	function submitForm() {
		const parsedValues = formSchema.safeParse(formValues);
		if (parsedValues.success) {
			if (mode === "create") {
				createFunction.mutate({
					...parsedValues.data,
				});
			} else {
				new Error("No Implement");
			}
		} else {
			// TODO: Error element with toast
		}
		onClose();
	}

	const handleSubmit = () => {
		const parsedValues = formSchema.safeParse(formValues);
		if (parsedValues.success) {
			setOpenConfirmDialog(true);
		}
	};

	// Create or update an entry
	return (
		<>
			<Dialog open={openForm} onOpenChange={setOpenForm}>
				<DialogTrigger asChild>
					<AlertDialogAction>Create</AlertDialogAction>
				</DialogTrigger>
				<DialogContent
					className={
						"max-h-screen overflow-y-scroll lg:max-w-screen-lg"
					}
				>
					<>
						{/* <AutoForm */}
						{/* 	className="mb-10 mr-5 ml-5 mt-5" */}
						{/* 	_defaultValues={{}} */}
						{/* 	values={formValues} */}
						{/* 	onValuesChange={setFormValues} */}
						{/* 	onSubmit={handleSubmit} */}
						{/* 	formSchema={formSchema} */}
						{/* 	fieldConfig={fieldConfig} */}
						{/* > */}
						{/* 	<div> */}
						{/* 		<div className="flex justify-between"> */}
						{/* 			<Button */}
						{/* 				type="button" */}
						{/* 				variant={"outline"} */}
						{/* 				onClick={() => { */}
						{/* 					if (mode === "create") { */}
						{/* 						setOpenConfirmDialog(false); */}
						{/* 						onClose(); */}
						{/* 					} */}
						{/* 				}} */}
						{/* 			> */}
						{/* 				Cancel */}
						{/* 			</Button> */}
						{/**/}
						{/* 			<Button type="submit"> */}
						{/* 				{mode === "create" && t("button.create")} */}
						{/* 			</Button> */}
						{/* 		</div> */}
						{/* 	</div> */}
						{/* </AutoForm> */}
						{/* Submit change dialog */}
						<Dialog
							open={openConfirmDialog}
							onOpenChange={setOpenConfirmDialog}
						>
							<DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>
										{t("others.check_data")}
									</DialogTitle>
									<DialogDescription></DialogDescription>
								</DialogHeader>
								<GeneralTable data={formValues} />
								<DialogFooter>
									<DialogClose asChild>
										<Button
											onClick={submitForm}
											type="submit"
										>
											{t("button.save")}
										</Button>
									</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</>
				</DialogContent>
			</Dialog>
		</>
	);
}

interface EmptyCreateProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	fieldConfig?: FieldConfig<z.infer<SchemaType>>;
	onClose: () => void;
	selectedTableType: BonusTableEnum;
	err_msg?: string;
	alertOpen: true | false;
	setAlertOpen: (alertOpen: true | false) => void;
}

export function EmptyCreate<SchemaType extends z.AnyZodObject>({
	formSchema,
	fieldConfig,
	onClose,
	selectedTableType,
	err_msg,
	alertOpen,
	setAlertOpen,
}: EmptyCreateProps<SchemaType>) {
	const router = useRouter();
	return (
		<>
			<BonusToolbarFunctionsProvider
				selectedTableType={selectedTableType}
				period_id={0}
			>
				<AlertDialog
					open={alertOpen}
					onOpenChange={(open) => {
						if (!open) {
							void router.replace("/parameters");
						}
					}}
				>
					<div className="flex h-full flex-col p-4"></div>
					<AlertDialogContent className="w-[90vw]">
						<AlertDialogHeader>
							<AlertDialogTitle>
								[system error message]: {err_msg}
							</AlertDialogTitle>
							<AlertDialogDescription>
								Please create one first.
							</AlertDialogDescription>
							<AlertDialogDescription></AlertDialogDescription>
						</AlertDialogHeader>
						<div className="m-4"></div>
						<AlertDialogFooter>
							<Button
								variant={"ghost"}
								onClick={() => setAlertOpen(!alertOpen)}
							>
								Cancel
							</Button>
							<EmptyCreateForm
								formSchema={formSchema}
								fieldConfig={fieldConfig}
								onClose={onClose}
							/>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</BonusToolbarFunctionsProvider>
		</>
	);
}
