import { useContext } from "react";
import { parameterToolbarFunctionsContext } from "../function_sheet/parameter_functions_context";
import { ExcelUploadDialogContent } from "~/components/file_operations/excel_upload_dialog_content";


export function ParameterExcelUpload({
	tableType,
	closeDialog,
}: {
	tableType: string;
	closeDialog: () => void;
}) {
	const functions = useContext(parameterToolbarFunctionsContext);

	const singleEntry =
		tableType == "TableAttendance" || tableType == "TableInsurance";

	const createFunction = functions.createFunction!;
	const batchCreateFunction = functions.batchCreateFunction!;

	return (
		<ExcelUploadDialogContent
			onClick={(data) => {
				console.log("data", data);
				// Multi sheet: sheet_name -> Obj[]
				// Single sheet: Obj[]
				if (Array.isArray(data)) {
					if (singleEntry && data[0]) createFunction.mutate(data[0]);
					else batchCreateFunction.mutate(data);
				}
				closeDialog();
			}}
			closeDialog={closeDialog}
		/>
	);
}

// const newRows = rows.slice(1).map((row, index) => {
// 	row = row.slice(2);
// 	return {
// 		salary_start: row[0],
// 		salary_end: row[1],
// 		dependent: row[2],
// 		tax_amount: row[3],
// 	};
// });

// call api if needed
// createAPI.mutate(newRows)
