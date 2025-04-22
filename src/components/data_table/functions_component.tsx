import { DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
} from "~/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { PencilLine } from "lucide-react";
import {
	type DataWithFunctions,
	type FunctionsItem,
} from "~/pages/parameters/components/context/data_table_context";
import { FunctionMenuOption } from "../table_functions/function_menu/function_menu_option";
import { cn } from "~/lib/utils";

export type FunctionsItemKey = keyof FunctionsItem;

interface FunctionsComponentProps<TMode, TData extends object> {
	setOpen: (open: boolean) => void;
	setMode: (mode: TMode) => void;
	data: TData & DataWithFunctions;
	setData: (data: TData & DataWithFunctions) => void;
	disabled?: boolean;
}

export function FunctionsComponent<TMode, TData extends object>({
	setOpen,
	setMode,
	data,
	setData,
	disabled = false,
}: FunctionsComponentProps<TMode, TData>) {
	const funcKey: FunctionsItemKey[] = ["creatable", "updatable", "deletable"];

	return (
		<DropdownMenu modal={false}>
			<div
				className={cn(
					"cursor-pointer",
					disabled && "cursor-not-allowed"
				)}
			>
				<DropdownMenuTrigger asChild>
					<Button
						disabled={disabled}
						variant="ghost"
						size="sm"
						className="h-8 lg:flex"
					>
						<PencilLine className=" stroke-[1.5]" />
					</Button>
				</DropdownMenuTrigger>
			</div>
			<DropdownMenuContent align="end" className="w-[120px]">
				{funcKey.map((key) => {
					const disable_mode = !(data?.functions[key] ?? false);
					// const disabled = !(data ? (data.functions ? data.functions[key] : false) : false);
					const mode =
						key == "creatable"
							? "create"
							: key == "updatable"
							? "update"
							: "delete";
					return (
						<div key={key}>
							{key == "creatable" && (
								<FunctionMenuOption.Create
									onClick={() => {
										setMode(mode as TMode);
										setData(data);
										setOpen(true);
									}}
									disabled={disable_mode}
								/>
							)}

							{key == "updatable" && (
								<FunctionMenuOption.Update
									onClick={() => {
										setMode(mode as TMode);
										setData(data);
										setOpen(true);
									}}
									disabled={disable_mode}
								/>
							)}

							{key == "deletable" && (
								<FunctionMenuOption.Delete
									onClick={() => {
										setMode(mode as TMode);
										setData(data);
										setOpen(true);
									}}
									disabled={disable_mode}
								/>
							)}
						</div>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
