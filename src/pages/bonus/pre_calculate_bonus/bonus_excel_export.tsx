import { useState } from "react";
import { api } from "~/utils/api";
import { usePeriodContext } from "~/components/context/period_context_provider";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import ExcelViewer from "./excel_export/ExcelViewer";
import {
	getExcelData,
	getBonusExcel,
	excludeDataColumn,
} from "./excel_export/utils";
import { useBonusFunctionContext } from "../components/context/data_table_context_provider";

export default function BonusExcelExport() {
	const { selectedPeriod } = usePeriodContext();
	const { selectedBonusType } = useBonusFunctionContext();

	const getExcelA = api.bonus.getExcelEmployeeBonus.useQuery({
		period_id: selectedPeriod?.period_id ?? 0,
		bonus_type: selectedBonusType,
	});
	const { data, isPending, content } = useQueryHandle(getExcelA);

	const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);

	const excludedColumns = [
		"id",
		"create_by",
		"create_date",
		"update_by",
		"update_date",
	];

	if (isPending) {
		return content;
	}

	return (
		<ExcelViewer
			original_sheets={getExcelData(
				excludeDataColumn(getBonusExcel(data), excludedColumns),
			)}
			original_data={getBonusExcel(data)}
			filter_component={<></>}
			selectedSheetIndex={selectedSheetIndex}
			setSelectedSheetIndex={setSelectedSheetIndex}
		/>
	);
}
