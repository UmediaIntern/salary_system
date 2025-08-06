import {
	EmployeePaymentInfo,
	EmployeePaymentRangeStatus,
} from "~/server/api/types/employee_payment_type";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";
import { cn } from "~/lib/utils";
import { OctagonAlert, OctagonX } from "lucide-react";

export function ColumnCellComponentWithInfo({
	info,
	range,
	data,
	relatedToPositionChange = false,
}: {
	info: EmployeePaymentInfo;
	range: EmployeePaymentRangeStatus;
	data: string | number;
	relatedToPositionChange?: boolean;
}) {
	const positionOrTypeChange =
		info.isPositionModified || info.isPositionTypeModified;
	const error_flag =
		!range.isInRange;
	const warning_flag =
		relatedToPositionChange
			? positionOrTypeChange && range.isInRange && !range.isModified
			: range.isInRange && !range.isModified;

	return (
		<ColumnCellComponent
			className={cn(
				"flex justify-center",
				error_flag
					? "text-destructive"
					: warning_flag
						? "text-yellow-400"
						: "",
			)}
		>
			<div className="flex items-center justify-center gap-2">
				{error_flag && <OctagonX />}
				{warning_flag && <OctagonAlert />}
				{data}
			</div>
		</ColumnCellComponent>
	);
}
