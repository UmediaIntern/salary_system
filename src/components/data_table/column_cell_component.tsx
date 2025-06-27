import { type PropsWithChildren } from "react";
import { cn } from "~/lib/utils";

interface ColumnCellComponentProps
	extends PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {}

export function ColumnCellComponent({
	children,
	className,
}: ColumnCellComponentProps) {
	return (
		<div className={cn("text-center font-medium", className)}>
			{children}
		</div>
	);
}
