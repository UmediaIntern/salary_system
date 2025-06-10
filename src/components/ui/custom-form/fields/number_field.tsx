import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { type FormFieldProps } from "../types";

export function NumberField({ inputProps, error, id, fixed }: FormFieldProps) {
	return (
		<Input
			id={id}
			type="number"
      step="any"
			className={cn((error ? "border-destructive" : ""), "[&::-webkit-inner-spin-button]:appearance-none")}
			{...inputProps}
			
			disabled={fixed==true?true:false}
		/>
	);
}
