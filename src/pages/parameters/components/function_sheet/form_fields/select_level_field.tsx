import { type FormFieldProps } from "~/components/ui/custom-form/types";
import { api } from "~/utils/api";
import { useFormContext } from "react-hook-form";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "~/components/ui/select";
import { useEffect } from "react";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";

export function SelectLevelField({
	field,
	value,
	inputProps,
	error,
	id,
}: FormFieldProps) {
	const { watch } = useFormContext();

	const startDateInput = watch("start_date");
	const parseStartDate = z
		.string()
		.or(z.date())
		.nullable()
		.pipe(z.coerce.date().nullable())
		.safeParse(startDateInput);

	// NOTE: Only for debug
	useEffect(() => {
		const subscription = watch((value, { name, type }) =>
			console.log("debug", value, name, type)
		);
		return () => subscription.unsubscribe();
	}, [watch]);


	const parseValue = z
		.number()
		.or(z.string())
		.pipe(z.coerce.string())
		.safeParse(value);

	if (!parseValue.success) {
		toast.error(`Select value is ${value}. Error: ${parseValue.error}`)
	}
	const defaultValueStr = parseValue.data;

	const { onChange }: { onChange: (event: any) => any } = inputProps;

	const onValueChange = (v: string) => {
		const event = {
			target: {
				name: field.key,
				value: v,
			},
		};
		onChange?.(event);
	};

	return parseStartDate.success && parseStartDate.data ? (
		<Select
			{...inputProps}
			onValueChange={onValueChange}
			defaultValue={defaultValueStr}
		>
			<SelectTrigger
				id={id}
				className={error ? "border-destructive" : ""}
			>
				<SelectValue placeholder="Select an option" />
			</SelectTrigger>
			<SelectLevelOptionsComp start_date={parseStartDate.data} />
		</Select>
	) : (
		<Input disabled placeholder="Set start date first" />
	);
}

function SelectLevelOptionsComp({ start_date }: { start_date: Date }) {
	const { data, isLoading } = api.parameters.getAllLevelByStartDate.useQuery({
		start_date: start_date,
	});

	if (isLoading) {
		return <p>Loading...</p>;
	}

	return (
		<SelectContent>
			{(data ?? []).map((d) => (
				<SelectItem key={d.id} value={d.level.toString()}>
					{d.level}
				</SelectItem>
			))}
		</SelectContent>
	);
}
