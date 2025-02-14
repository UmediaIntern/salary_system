import { Input } from "~/components/ui/input";
import { type FormFieldProps } from "../types";

export function StringField({ inputProps, error, id, fixed }: FormFieldProps) {
	return (
		<Input
			id={id}
			className={error ? "border-destructive" : ""}
			{...inputProps}
			disabled={fixed==true?true:false}
		/>
	);
}
