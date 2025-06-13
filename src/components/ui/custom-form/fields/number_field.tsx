import { useEffect } from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { type FormFieldProps } from "../types";

export function NumberField({ inputProps, error, id, fixed }: FormFieldProps) {
	useEffect(() => {
		const inputElement = document.getElementById(id);

		const handleWheel = (e: WheelEvent) => {
			if (inputElement && inputElement === document.activeElement) {
			e.preventDefault(); // Prevent scroll wheel from changing the value
			}
		};

		// Add event listener for wheel
		inputElement?.addEventListener("wheel", handleWheel, { passive: false });

		return () => {
			// Cleanup event listener when the component unmounts
			inputElement?.removeEventListener("wheel", handleWheel);
		};
	}, [id]);


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
