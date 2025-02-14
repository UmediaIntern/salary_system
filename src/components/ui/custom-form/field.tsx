import React from "react";
import { useFormContext } from "react-hook-form";
import { type FormFieldProps, type ParsedField } from "./types";
import { getLabel, getPathInObject } from "./utils";
import { FieldWrapper } from "./field-wrapper";
import { ErrorMessage } from "./field-error-message";
import { FIELD_COMPONENTS } from "./config";

export function AutoFormField({
	field,
	path,
  render,
  fixed,
}: {
	field: ParsedField;
	path: string[];
	render?: React.ComponentType<FormFieldProps>;
	fixed?: boolean;
}) {
	const {
		register,
		formState: { errors },
    watch,
	} = useFormContext();

	const fullPath = path.join(".");
	const error = getPathInObject(errors, path)?.message;
	const value = watch(fullPath);

	let FieldComponent: React.ComponentType<FormFieldProps> = () => (
		<ErrorMessage
			error={`[AutoForm Configuration Error] No component found for type "${field.type}" nor a fallback`}
		/>
	);

	/* if (field.type === "array") { */
	/* 	FieldComponent = ArrayField; */
	/* } else if (field.type === "object") { */
	/* 	FieldComponent = ObjectField; */
  if (render){
    FieldComponent = render
  }
  else if (field.type in FIELD_COMPONENTS) {
		FieldComponent = FIELD_COMPONENTS[field.type as keyof typeof FIELD_COMPONENTS];
	} else if ("fallback" in FIELD_COMPONENTS) {
		FieldComponent = FIELD_COMPONENTS.fallback;
	}

	return (
		<FieldWrapper
			label={getLabel(field)}
			error={error}
			id={fullPath}
			field={field}
		>
			<FieldComponent
				label={getLabel(field)}
				field={field}
				value={value}
				error={error}
				id={fullPath}
				key={fullPath}
				path={path}
				inputProps={{
					required: field.required,
					error: error,
					key: `${fullPath}-input`,
					...field.fieldConfig?.inputProps,
					...register(fullPath),
				}}
				fixed={fixed}
			/>
		</FieldWrapper>
	);
}
