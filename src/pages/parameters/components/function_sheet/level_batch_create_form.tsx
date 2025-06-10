import * as z from "zod";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { useTranslation } from "react-i18next";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogFooter,
} from "~/components/ui/dialog";
import { PenSquare, Trash2 } from "lucide-react";

import { useContext } from "react";
import { parameterToolbarFunctionsContext } from "./parameter_functions_context";
import GeneralTable from "../../../../components/table_functions/general_table";
import { LoadingSpinner } from "~/components/loading";
import { FieldConfig } from "~/components/ui/auto-form/types";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { FunctionModeEnumType } from "../context/data_table_context";

interface ParameterFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	fieldConfig?: FieldConfig<z.infer<SchemaType>>;
	defaultValue?: any;
	mode: FunctionModeEnumType;
	closeSheet: () => void;
}

export function LevelBatchCreateForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	fieldConfig,
	defaultValue,
	mode,
	closeSheet,
}: ParameterFormProps<SchemaType>) {
	const functions = useContext(parameterToolbarFunctionsContext);

	const queryFunction = functions.queryFunction!;
	const updateFunction = functions.updateFunction!;
	const createFunction = functions.createFunction!;
	const deleteFunction = functions.deleteFunction!;
	const { isLoading, isError, data, error } = queryFunction();

	const isList = Array.isArray(data);
	const onlyOne = !(isList && data.length > 1);

	const [selectedData, setSelectedData] = useState(
		defaultValue ?? (isList ? null : data)
	);

	const [formValues, setFormValues] = useState<
		Partial<z.infer<z.AnyZodObject>>
	>(getDefaults(formSchema));

	const [openDialog, setOpenDialog] = useState(false);
	const { t } = useTranslation(["common"]);

	function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
		return Object.fromEntries(
			Object.entries(schema.shape).map(([key, value]) => {
				if (value instanceof z.ZodDefault)
					return [key, value._def.defaultValue()];
				return [key, undefined];
			})
		);
	}

	function submitForm() {
		const parsedValues = formSchema.safeParse(formValues);
		if (parsedValues.success) {
			if (mode === "create") {
				createFunction.mutate({
					...parsedValues.data,
				});
			} else if (mode === "update") {
				updateFunction.mutate({
					...parsedValues.data,
					id: selectedData.id,
				});
			}
		} else {
			// TODO: Error element with toast
		}
		closeSheet();
	}

	const handleSubmit = () => {
		const parsedValues = formSchema.safeParse(formValues);
		if (parsedValues.success) {
			setOpenDialog(true);
		}
	};

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	const schema = z.object({
		levels: z.array(
			z.object({
				level: z.coerce.number(),
			})
		),
	});

	type FormValues = z.infer<typeof schema>;

	function DynamicForm() {
		const { control, handleSubmit, register } = useForm<FormValues>({
			resolver: zodResolver(schema),
			defaultValues: {
				levels: [], // Start with an empty array
			},
		});

		const { fields, append, remove } = useFieldArray({
			control,
			name: "levels",
		});

		const onSubmit = async (data: FormValues) => {
			data.levels.map(async (l) => {
				await createFunction.mutateAsync(l);
			})
			closeSheet();
		};

		return (
			<>
				<Separator />
				<form onSubmit={handleSubmit(onSubmit)} className="h-full">
					<div className="flex flex-col h-full"> {/* Set the height for the form */}

						{/* Scrollable Area */}
						<div className="flex-grow overflow-y-auto space-y-4 p-4">
							{fields.map((field, index) => (
								<div className="flex items-center gap-4 w-full" key={field.id}>
									{/* Level Input */}
									<div className="flex flex-row items-center justify-between w-full gap-4">
										<Label className="min-w-[50px]"> {t("table.level")} </Label>
										<Input
											className="flex-grow"
											type="number"
											{...register(`levels.${index}.level` as const)}
										/>
										<button
											type="button"
											onClick={() => remove(index)}
											className="text-red-500"
										>
											<Trash2 className="h-5 w-5" />
										</button>
									</div>
								</div>
							))}
							{/* Add Row Button (Scrolls with the rows) */}
							<Button
								type={"button"}
								variant={"outline"}
								onClick={() => append({ level: 0 })}
								className="w-full"
							>
								{t("button.create")}
							</Button>
						</div>

						{/* Fixed Cancel and Submit Buttons (Outside of Scrollable Area) */}
						<div className="flex justify-between pb-6 bg-white">
							{/* Cancel Button */}
							<Button
								variant={"destructive"}
								onClick={() => closeSheet()}
							>
								{t("button.cancel")}
							</Button>
							{/* Submit Button */}
							<Button type="submit">
								{t("button.batch_create")}
							</Button>
						</div>
					</div>
				</form>
			</>
		);


	}

	// Create or update an entry
	return (
		<>
			<DynamicForm />
			{/* Submit change dialog */}
			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{t("others.check_data")}</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>
					<GeneralTable data={formValues} />
					<DialogFooter>
						<DialogClose asChild>
							<Button onClick={submitForm} type="submit">
								{t("button.save")}
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
