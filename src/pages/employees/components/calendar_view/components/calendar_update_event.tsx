import React, { useContext, useState } from "react";
import calendarContext from "../context/calendar_context";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "~/components/ui/sheet";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import dataTableContext from "../../context/data_table_context";
import { getTableNameKey } from "../../context/data_table_enum";
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
import { Button } from "~/components/ui/button";
// import AutoForm from "~/components/ui/auto-form";
import { z } from "zod";
import { employeeToolbarFunctionsContext } from "../../function_sheet/employee_functions_context";
import { modeDescription } from "~/lib/utils/helper_function";
import { getSchema } from "~/pages/employees/schemas/get_schemas";
import GeneralTable from "~/components/table_functions/general_table";

/* interface CalendarUpdateEventProps<SchemaType extends z.AnyZodObject> { } */
interface CalendarUpdateEventProps {}

export default function CalendarUpdateEvent({}: CalendarUpdateEventProps) {
	const { updateSheet, setUpdateSheet, resetMouse, selectedEvent } =
		useContext(calendarContext);

	const mutateFunctions = useContext(employeeToolbarFunctionsContext);
	const updateFunction = mutateFunctions.updateFunction!;

	const { selectedTableType } = useContext(dataTableContext);
	const formSchema = getSchema(selectedTableType);

	const [formValues, setFormValues] = useState<
		Partial<z.infer<z.AnyZodObject>>
	>(getDefaults(formSchema));

	const [openDialog, setOpenDialog] = useState(false);
	const { t } = useTranslation(["common"]);

	function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
		return Object.fromEntries(
			Object.entries(schema.shape as Record<string, any>).map(
				([key, value]) => {
					if (value instanceof z.ZodDefault)
						return [key, value._def.defaultValue()];
					return [key, undefined];
				}
			)
		);
	}

	const mode = "update";

	const handleSubmit = () => {
		const parsedValues = formSchema.safeParse(formValues);
		if (parsedValues.success) {
			setOpenDialog(true);
		}
	};

	function submitForm() {
		const parsedValues = formSchema.safeParse(formValues);
		if (parsedValues.success) {
			updateFunction.mutate({
				...parsedValues.data,
				id: selectedEvent?.getData()?.id,
			});
		} else {
			// TODO: Error element with toast
		}
		setUpdateSheet(false);
	}

	return (
		<Sheet
			open={updateSheet}
			onOpenChange={(open: boolean) => {
				setUpdateSheet(open);
				resetMouse();
			}}
		>
			<SheetContent className="w-[50%]">
				<SheetHeader>
					<SheetTitle>
						{`${t(`button.${mode}`)!}${t("button.form")} (${t(getTableNameKey(selectedTableType))}`}
					</SheetTitle>
					<SheetDescription>{modeDescription(t, mode)}</SheetDescription>
				</SheetHeader>
				<ScrollArea className="h-[85%] w-full">
					{/* <AutoForm
						className="mb-10 mr-5 ml-5 mt-5"
						_defaultValues={selectedEvent?.getData()}
						values={formValues}
						onValuesChange={setFormValues}
						onSubmit={handleSubmit}
						formSchema={formSchema}
					>
						<div>
							<div className="my-16 flex justify-between">
								<Button
									type="button"
									variant={"outline"}
									onClick={() => {
										setUpdateSheet(false);
									}}
								>
									Cancel
								</Button>

								<Button type="submit">Update</Button>
							</div>
						</div>
					</AutoForm> */}
					{/* Submit change dialog */}
					<Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
									<Button onClick={submitForm} type="submit">
										{t("button.save")}
									</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
