import { modeDescription } from "~/lib/utils/helper_function";
import {
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "~/components/ui/sheet";
import { type TFunction } from "i18next";
import { type PropsWithChildren } from "react";
import { getTableNameKey } from "../context/data_table_enum";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useDataTableContext } from "../context/data_table_context_provider";

export type FunctionsItem = {
	create: boolean;
	update: boolean;
	delete: boolean;
};
export type FunctionsItemKey = keyof FunctionsItem;

interface FunctionsSheetProps extends PropsWithChildren {
	t: TFunction<[string], undefined>;
	period_id: number;
}

export function FunctionsSheetContent({
	t,
	period_id,
	children,
}: FunctionsSheetProps) {
	const { mode, selectedTableType } = useDataTableContext();
	return (
		<SheetContent className="max-w-[33vw] sm:min-w-[500px] px-10 py-6">
			<ScrollArea className="h-full w-full px-2">
				<SheetHeader>
					<SheetTitle>
						{`${t(`button.${mode}`)!}${t("button.form")} (${t(
							`${getTableNameKey(selectedTableType)}`
						)})`}
					</SheetTitle>
					<SheetDescription>
						{modeDescription(t, mode as string)}
					</SheetDescription>
				</SheetHeader>
				{children}
			</ScrollArea>
		</SheetContent>
	);
}
