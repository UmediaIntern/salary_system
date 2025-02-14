import { type PropsWithChildren, type ReactNode } from "react";
import { type FieldPath, type UseFormReturn } from "react-hook-form";
import { type ZodObjectOrWrapped } from "./utils";
import { type z } from "zod";

export type Renderable<AdditionalRenderable = null> =
	| string
	| number
	| boolean
	| null
	| undefined
	| AdditionalRenderable;

export interface FieldConfig<
	AdditionalRenderable = null,
	FieldTypes = string,
> {
	render?: React.ComponentType<FormFieldProps>;	
  hidden?: boolean;
  // Determine if any of the following is needed
	description?: Renderable<AdditionalRenderable>;
	inputProps?: Record<string, any>;
	label?: Renderable<AdditionalRenderable>;
	fieldType?: FieldTypes;

	// fixed value
	fixed?: boolean;
}

/**
  Define the form, including form fields and display fields
*/
export interface FormConfigEntry<SchemaType extends ZodObjectOrWrapped> {
	key: FieldPath<z.infer<SchemaType>>;
	config: FieldConfig;
}
export type FormConfig<S extends ZodObjectOrWrapped> = FormConfigEntry<S>[];

export interface FormEntries<AdditionalRenderable = null, FieldTypes = string> {
	entries: {
		field: ParsedField<AdditionalRenderable, FieldTypes>;
		config?: FieldConfig;
	}[];
}

export interface CustomFormProps<SchemaType extends ZodObjectOrWrapped>
	extends PropsWithChildren {
	formSchema: SchemaType;
	form: UseFormReturn<z.TypeOf<SchemaType>, any, undefined>;
	formConfig?: FormConfig<SchemaType>;
	values?: Partial<z.infer<SchemaType>>;
	onValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
	onParsedValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
	onSubmit?: (values: z.infer<SchemaType>) => void;
	className?: string;
  formId?: string;
}

/**
 * A FormInput component can handle a specific Zod type (e.g. "ZodBoolean")
 */
export interface FormFieldProps {
	label: Renderable<ReactNode>;
	field: ParsedField;
	value: any;
	error?: string;
	id: string;
	path: string[];
	inputProps: any;
	/* inputProps?: React.InputHTMLAttributes<HTMLInputElement> & { */

	fixed?: boolean;
}

export interface ParsedField<AdditionalRenderable = null, FieldTypes = string> {
	key: string;
	type: string;
	required: boolean;
	default?: any;
	description?: Renderable;
	fieldConfig?: FieldConfig<AdditionalRenderable, FieldTypes>;

	// Field-specific
	options?: [string, string][]; // [value, label] for enums
	schema?: ParsedField<AdditionalRenderable, FieldTypes>[]; // For objects and arrays
}

export interface ParsedSchema<
	AdditionalRenderable = null,
	FieldTypes = string
> {
	fields: ParsedField<AdditionalRenderable, FieldTypes>[];
}
