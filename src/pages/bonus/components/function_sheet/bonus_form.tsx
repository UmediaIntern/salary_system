import { TypeOf, type z } from "zod";
import { useContext, useEffect, useState } from "react";
import { bonusToolbarFunctionsContext } from "./bonus_functions_context";
import { type FormConfig } from "~/components/ui/custom-form/types";
import dataTableContext, { type FunctionMode } from "../context/data_table_context";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import periodContext from "~/components/context/period_context";

import { buildStandardFormProps, StandardForm } from "~/components/form/default/form_standard";
import { bonusAllSchema } from "../../schemas/configurations/bonus_all_schema";
import { DefaultValues } from "react-hook-form";
import { Button } from "~/components/ui/button";

interface BonusFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	formConfig?: FormConfig<SchemaType>;
	formSubmit?: (data: z.infer<SchemaType>) => void;
	defaultValue?: DefaultValues<z.infer<SchemaType>> | undefined;
	mode: FunctionMode;
	closeSheet: () => void;
}

export function BonusForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	formConfig,
	formSubmit,
	defaultValue,
	mode,
	closeSheet,
}: BonusFormProps<SchemaType>) {
	const { data, selectedBonusType } = useContext(dataTableContext);
	const { selectedPeriod } = useContext(periodContext);
	const functions = useContext(bonusToolbarFunctionsContext);
	const createFunction = functions.createFunction!;
	const updateFunction = functions.updateFunction!;		

	const onSubmit = (d: z.infer<typeof formSchema>) => {
		console.log(d);
		if (mode === "create") {
			createFunction.mutate({ ...d, bonus_type: selectedBonusType, period_id: selectedPeriod!.period_id });
		} else if (mode === "update") {
			updateFunction.mutate({ ...d, bonus_type: selectedBonusType, period_id: selectedPeriod!.period_id });
		}
		closeSheet();
	};

	const formProps = data && buildStandardFormProps({
		formSchema: formSchema,
		formConfig: formConfig,
		formSubmit: (d) => {
			onSubmit(d);
		},
		buttonText: mode,
		defaultValue: defaultValue,
		closeSheet: () => closeSheet(),
	});


	return (
		<>
			{<StandardForm {...formProps} />}
		</>
	);
}