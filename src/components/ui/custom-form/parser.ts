import { z } from "zod";
import {
	type FormConfig,
	type ParsedField,
	type ParsedSchema,
	type FormEntries,
} from "./types";
import { inferFieldType } from "./infer-field-type";

export type ZodObjectOrWrapped =
	| z.ZodObject<any, any>
	| z.ZodEffects<z.ZodObject<any, any>>;

function parseField(
	key: string,
	schema: z.ZodAny | z.AnyZodObject
): ParsedField {
	const baseSchema = getBaseSchema(schema);
	/* const fieldConfig = getFieldConfigInZodStack(schema); */
	const type = inferFieldType(baseSchema, undefined);
	/* const defaultValue = getDefaultValueInZodStack(schema); */

	// Enums
	let optionValues: [string, string][] = [];
	if (baseSchema instanceof z.ZodEnum) {
		const options = baseSchema.Values;
		if (options) {
			if (!Array.isArray(options)) {
				optionValues = Object.entries(options);
			} else {
				optionValues = options.map((value) => [value, value]);
			}
		}
	}

	// Arrays and objects
	let subSchema: ParsedField[] = [];
	if (baseSchema instanceof z.ZodObject) {
		const shape: z.infer<typeof baseSchema> = baseSchema.shape;
		subSchema = Object.entries(shape).map(([key, field]) =>
			parseField(key, field as z.ZodAny)
		);
	}
	if (baseSchema instanceof z.ZodArray) {
		subSchema = [parseField("0", baseSchema.element as z.ZodAny)];
	}

	return {
		key,
		type,
		required: !schema.isOptional(),
		/* default: defaultValue, */
		description: baseSchema.description,
		/* fieldConfig, */
		options: optionValues,
		schema: subSchema,
	};
}

/**
 * Get the lowest level Zod type.
 * This will unpack optionals, refinements, etc.
 */
function getBaseSchema<ChildType extends z.ZodAny | z.AnyZodObject = z.ZodAny>(
	schema: ChildType | z.ZodEffects<ChildType>
): ChildType {
	if ("innerType" in schema._def) {
		return getBaseSchema(schema._def.innerType as ChildType);
	}
	if ("schema" in schema._def) {
		return getBaseSchema(schema._def.schema);
	}

	return schema as ChildType;
}

export function parseSchema(schema: ZodObjectOrWrapped): ParsedSchema {
	const objectSchema =
		schema instanceof z.ZodEffects ? schema.innerType() : schema;

	const shape: z.infer<typeof objectSchema> = objectSchema.shape;

	const fields: ParsedField[] = Object.entries(shape).map(([key, field]) =>
		parseField(key, field as z.ZodAny)
	);

	return { fields };
}

export function createFormEntries<T extends ZodObjectOrWrapped>(
	formFields: ParsedSchema,
	config: FormConfig<T> | undefined = []
): FormEntries {
	const entries = formFields.fields.map((field) => {
		const cfg = config.find((c) => c.key === field.key)?.config;
		if (cfg?.options) {
			field.options = cfg.options;
		}
		return {
			field: field,
			config: cfg,
		};
	});

	return {
		entries: entries,
	};
}
