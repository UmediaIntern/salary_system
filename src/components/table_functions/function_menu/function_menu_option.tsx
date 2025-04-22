import {
	ArrowUpFromLine,
	Calculator,
	Download,
	PenSquare,
	Plus,
	RefreshCcw,
	Trash2,
	type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

interface FunctionMenuOptionProps {
	onClick: () => void;
	itemName: string;
	icon: LucideIcon;
	disabled?: boolean;
}

export function FunctionMenuOptionBase({
	onClick,
	itemName,
	icon: Icon,
	disabled,
}: FunctionMenuOptionProps) {
	return (
		<div className={cn(disabled && "cursor-not-allowed")}>
			<DropdownMenuItem
				disabled={disabled} // * Comment for debug
				onClick={onClick}
			>
				<Icon
					className={cn(
						"mr-2 h-4 w-4",
						disabled && "stroke-muted-foreground"
					)}
				/>
				<span className={cn(disabled && "stroke-muted-foreground")}>
					{itemName}
				</span>
			</DropdownMenuItem>
		</div>
	);
}

interface SubProps {
	onClick: () => void;
	disabled?: boolean;
}

function createOptionComponent(buttonKey: string, Icon: LucideIcon) {
	return function OptionComponent({ onClick, disabled }: SubProps) {
		const { t } = useTranslation(["common"]);
		return (
			<FunctionMenuOptionBase
				onClick={onClick}
				disabled={disabled}
				itemName={t(`button.${buttonKey}`)}
				icon={Icon}
			/>
		);
	};
}

export const FunctionMenuOption = {
	Create: createOptionComponent("create", Plus),
	Update: createOptionComponent("update", PenSquare),
	Delete: createOptionComponent("delete", Trash2),
	ExcelDownload: createOptionComponent("excel_download", Download),
	ExcelUpload: createOptionComponent("excel_upload", PenSquare),
	Initialize: createOptionComponent("initialize", RefreshCcw),
	AutoCalculate: createOptionComponent("auto_calculate", Calculator),
	AdjustBaseSalary: createOptionComponent(
		"adjust_base_salary",
		ArrowUpFromLine
	),
};
