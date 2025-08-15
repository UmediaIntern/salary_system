import { type z } from "zod";
import { useContext } from "react";
import { parameterToolbarFunctionsContext } from "./parameter_functions_context";
import { type FormConfig } from "~/components/ui/custom-form/types";
import {
	type FunctionModeEnumType,
} from "../context/data_table_context";
import { StandardForm } from "~/components/form/default/form_standard";
import { useDataTableContext } from "../context/data_table_context_provider";
import { useTranslation } from "react-i18next";

export interface FormSchemaConfig<SchemaType extends z.AnyZodObject> {
	mode: FunctionModeEnumType;
	formSchema: SchemaType;
	formConfig?: FormConfig<SchemaType>;
}

interface ParameterFormProps<SchemaType extends z.AnyZodObject> extends FormSchemaConfig<SchemaType> {
	formSubmit?: (data: z.infer<SchemaType>) => void;
	mode: FunctionModeEnumType;
	closeSheet: () => void;
}

export function ParameterForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	formConfig,
	formSubmit,
	mode,
	closeSheet,
}: ParameterFormProps<SchemaType>) {
	const { data } = useDataTableContext();
	const { t } = useTranslation(["common"]);
	const functions = useContext(parameterToolbarFunctionsContext);
	const createFunction = functions.createFunction!;
	const updateFunction = functions.updateFunction!;

	const schema = (
		mode === "create" ? formSchema.omit({ id: true }) : formSchema
	) as SchemaType;

	const onSubmit = (d: z.infer<typeof formSchema>) => {
		if (mode === "create") {
			createFunction.mutate(d);
		} else if (mode === "update") {
			updateFunction.mutate(d);
		}
		closeSheet();
	};

	return (
		<StandardForm
			formSchema={schema}
			formConfig={formConfig}
			formSubmit={onSubmit}
			defaultValue={data}
			buttonText={mode}
			closeSheet={closeSheet}
		/>
	);
}
