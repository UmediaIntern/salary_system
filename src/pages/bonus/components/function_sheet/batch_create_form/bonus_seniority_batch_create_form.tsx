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
import { PenSquare, Trash2, PlusCircle } from "lucide-react";

import { useContext } from "react";
import { bonusToolbarFunctionsContext } from "../bonus_functions_context";
import { FunctionMode } from "../data_table_functions";
import { LoadingSpinner } from "~/components/loading";
import { FieldConfig } from "~/components/ui/auto-form/types";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import periodContext from "~/components/context/period_context";
import GeneralTable from "~/components/table_functions/general_table";

interface ParameterFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	fieldConfig?: FieldConfig<z.infer<SchemaType>>;
	defaultValue?: any;
	mode: FunctionMode;
	bonusType: BonusTypeEnumType;
	closeSheet: () => void;
}

export function BonusSeniorityBatchCreateForm<
	SchemaType extends z.AnyZodObject
>({
	formSchema,
	fieldConfig,
	defaultValue,
	mode,
	bonusType,
	closeSheet,
}: ParameterFormProps<SchemaType>) {
	const functions = useContext(bonusToolbarFunctionsContext);
	const period = useContext(periodContext)

	const queryFunction = functions.queryFunction!;
	const updateFunction = functions.updateFunction!;
	const createFunction = functions.createFunction!;
	const deleteFunction = functions.deleteFunction!;
	const { isLoading, isError, data, error } = queryFunction();

	const isList = Array.isArray(data);

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
		bonus_seniority: z.array(
			z.object({
				seniority: z.coerce.number(),
				multiplier: z.coerce.number(),
			})
		),
	});

	type FormValues = z.infer<typeof schema>;

	function DynamicForm() {
		const { control, handleSubmit, register } = useForm<FormValues>({
			resolver: zodResolver(schema),
			defaultValues: {
				bonus_seniority: [], // Start with an empty array
			},
		});

		const { fields, append, remove } = useFieldArray({
			control,
			name: "bonus_seniority",
		});

		const onSubmit = async (data: FormValues) => {
			data.bonus_seniority.map(async (x) => {
				console.log(x);
				await createFunction.mutateAsync(
					{ ...x, bonus_type: bonusType, period_id: period.selectedPeriod?.period_id },
				);
			});
			closeSheet();
		};

		return (
			<>
				<Separator />
				<form onSubmit={handleSubmit(onSubmit)} className="h-full">
					<div className="flex h-full flex-col">
						{" "}
						{/* Set the height for the form */}
						{/* Scrollable Area */}
						<div className="flex-grow space-y-4 overflow-y-auto p-4">
							{fields.map((field: any, index: number) => (
								<div
									className="flex w-full items-center gap-4"
									key={field.id}
								>
									<div className="flex w-full flex-row items-center justify-between gap-4">
										{/* work_type Input */}
										<Label className="min-w-[75px] text-center">
											{t("table.seniority")}{" "}
										</Label>
										<Input
											className="flex-grow"
											type="number"
											{...register(
												`bonus_seniority.${index}.seniority` as const
											)}
										/>
										{/* multiplier Input */}
										<Label className="min-w-[75px] text-center">
											{t("table.multiplier")}{" "}
										</Label>
										<Input
											className="flex-grow"
											type="number"
											step="0.01"
											{...register(
												`bonus_seniority.${index}.multiplier` as const
											)}
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
							<div className="flex justify-center">
								<Button
									type={"button"}
									variant={"ghost"}
									onClick={() => append({ seniority: 0, multiplier: 0 })}
								>
									<PlusCircle />
								</Button>
							</div>
							{/* <Button
								type={"button"}
								variant={"outline"}
								onClick={() =>
									append({ work_type: "", multiplier: 0 })
								}
								className="w-full"
							>
								{t("button.create")}
							</Button> */}
						</div>
						{/* Fixed Cancel and Submit Buttons (Outside of Scrollable Area) */}
						<div className="flex justify-between bg-white pb-6">
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
