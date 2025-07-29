import { useContext, useState } from "react";
import dataTableContext from "../components/context/data_table_context";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n, locales } from "~/components/lang_config";
import { api } from "~/utils/api";
import { usePeriodContext } from "~/components/context/period_context_provider";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import ExcelViewer from "./excel_export/ExcelViewer";
import {
	getExcelData,
	getBonusExcel,
	excludeDataColumn,
} from "./excel_export/utils";

export default function BonusExcelExport() {
	const { selectedPeriod } = usePeriodContext();
	const { selectedBonusType } = useContext(dataTableContext);

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

export const getStaticProps = async ({ locale }: { locale: string }) => {
	return {
		props: {
			...(await serverSideTranslations(
				locale,
				["common", "nav"],
				i18n,
				locales,
			)),
		},
	};
};
