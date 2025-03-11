import React, { useContext } from "react";
import calendarContext from "../context/calendar_context";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "~/components/ui/sheet";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { ParameterForm } from "../../function_sheet/parameter_form";
import dataTableContext from "../../context/data_table_context";
import { getTableNameKey } from "../../context/data_table_enum";
import { getSchema } from "~/pages/parameters/schemas/get_schemas";
import { useTranslation } from "react-i18next";
import { modeDescription } from "~/lib/utils/helper_function";

export default function CalendarAddEvent() {
	const { openSheet, mouseDownDate, mouseUpDate, setOpenSheet, resetMouse } =
		useContext(calendarContext);
	const { selectedTableType } = useContext(dataTableContext);
	const { t } = useTranslation(["common"]);

	const mode = "create";

	return (
		<Sheet
			open={openSheet}
			onOpenChange={(open: boolean) => {
				setOpenSheet(open);
				resetMouse();
			}}
		>
			<SheetContent className="w-[50%] px-12 py-6">
				<ScrollArea className="h-full w-full">
					<SheetHeader>
						<SheetTitle>
							{`${t(`button.${mode}`)!}${t("button.form")} (${t(
								getTableNameKey(selectedTableType)
							)})`}
						</SheetTitle>
						<SheetDescription>
							{modeDescription(t, mode)}
						</SheetDescription>
					</SheetHeader>
					<ParameterForm
						formSchema={getSchema(selectedTableType)!}
						mode={mode}
						closeSheet={() => {
							setOpenSheet(false);
							resetMouse();
						}}
						defaultValue={{
							start_date: mouseDownDate
								? new Date(mouseDownDate.format("YYYY-MM-DD"))
								: undefined,
							end_date: mouseUpDate
								? (new Date(
										mouseUpDate.format("YYYY-MM-DD")
								  ) as any)
								: undefined,
						}}
					/>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
