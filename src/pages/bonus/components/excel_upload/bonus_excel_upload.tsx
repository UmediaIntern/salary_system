import { useContext } from "react";
import { bonusToolbarFunctionsContext } from "../function_sheet/bonus_functions_context";
import { ExcelUploadDialogContent } from "~/components/file_operations/excel_upload_dialog_content";
import { usePeriodContext } from "~/components/context/period_context_provider";
import dataTableContext from "../context/data_table_context";

export function BonusExcelUpload({
	tableType,
	closeDialog,
}: {
	tableType: string;
	closeDialog: () => void;
}) {
	const functions = useContext(bonusToolbarFunctionsContext);
	const singleEntry = tableType == "TableBonusAll";

	const { selectedPeriod } = usePeriodContext();
	const { selectedBonusType } = useContext(dataTableContext);

	const createFunction = functions.createFunction!;
	const batchCreateFunction = functions.batchCreateFunction!;

	return (
		<ExcelUploadDialogContent
			onClick={(data) => {
				console.log("data", data);
				// Multi sheet: sheet_name -> Obj[]
				// Single sheet: Obj[]
				if (Array.isArray(data)) {
					const period_id = selectedPeriod?.period_id ?? 0;
					const input = data.map((d) => {
						return {
							...d,
							period_id: period_id,
							bonus_type: selectedBonusType,
						} as unknown;
					});
					if (singleEntry && input[0]) createFunction.mutate(input[0]);
					else batchCreateFunction.mutate(data);
				}
				closeDialog();
			}}
			closeDialog={closeDialog}
		/>
	);
}
