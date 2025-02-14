import { Input } from "~/components/ui/input";
import { type FormFieldProps } from "../types";

export function NumberField({ inputProps, error, id, fixed }: FormFieldProps) {
	return (
		<Input
			id={id}
			type="number"
      step="any"
			className={error ? "border-destructive" : ""}
			{...inputProps}
			disabled={fixed==true?true:false}
		/>
	);
}
