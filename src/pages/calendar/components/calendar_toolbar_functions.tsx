import { cn } from "~/lib/utils";
import { useState } from "react";
import { type LucideIcon, Plus, PlusSquare } from "lucide-react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";

import { Button } from "~/components/ui/button";
import { getTableNameKey, type TableEnum } from "../../context/data_table_enum";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";
import { useTranslation } from "react-i18next";
import { ParameterForm } from "../../function_sheet/parameter_form";
import { getSchema } from "~/pages/parameters/schemas/get_schemas";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { modeDescription } from "~/lib/utils/helper_function";

interface CalendarToolbarFunctionsProps
	extends React.HTMLAttributes<HTMLDivElement> {
	tableType: TableEnum;
}

export type FunctionMode = "create" | "update" | "delete" | "none";

export function CalendarToolbarFunctions({
	tableType,
	className,
}: CalendarToolbarFunctionsProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");
	const { t } = useTranslation(['common', 'nav']);

	return (
		<div className={cn(className, "flex h-full items-center")}>
			<Sheet open={open} onOpenChange={setOpen}>
				{/* Dropdown */}
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="ml-auto hidden h-8 lg:flex"
						>
							<PlusSquare className="cursor-pointer stroke-[1.5]" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[120px]">
						<DropdownMenuLabel>{t("others.functions")}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<CompTriggerItem
							mode={"create"}
							itemName={t("button.create")}
							icon={Plus}
						/>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* Sheet */}
				<SheetContent className="w-[50%]">
					<SheetHeader>
						<SheetTitle>
							{`${t(`button.${mode}`)!}${t("button.form")} (${t(getTableNameKey(tableType))})`}
						</SheetTitle>
						<SheetDescription>
							{modeDescription(t, mode)}
						</SheetDescription>
					</SheetHeader>
					<ScrollArea className="h-[85%] w-full">
						<ParameterForm
							formSchema={getSchema(tableType)!}
							mode={mode}
							closeSheet={() => setOpen(false)}
						/>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</SheetContent>
			</Sheet>
		</div>
	);

	function CompTriggerItem(props: {
		mode: FunctionMode;
		itemName: string;
		icon: LucideIcon;
	}) {
		return (
			<SheetTrigger
				className="w-full"
				onClick={() => {
					setMode(props.mode);
					setOpen(true);
				}}
			>
				<DropdownMenuItem className="cursor-pointer">
					<props.icon className="mr-2 h-4 w-4" />
					<span>{props.itemName}</span>
				</DropdownMenuItem>
			</SheetTrigger>
		);
	}
}
