/* ShadCN UI */
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { ExcelUpload } from "~/components/file_operations/excel_upload";

export default function BonusExcelImport() {
	const [selectedFile, setSelectedFile] = useState<string>("");
	const [datas, setDatas] = useState<Array<{ name: string; data: any[][] }>>(
		[],
	);

	const [errorEmployees, setErrorEmployees] = useState<Array<string>>([]);

	const updateFromExcel = api.bonus.updateFromExcel.useMutation({
		onSuccess: (data) => {
			const newErrorEmployees = errorEmployees;
			data.map((d) => {
				if (!(d in newErrorEmployees)) newErrorEmployees.push(d);
			});
			setErrorEmployees(newErrorEmployees);
		},
		onError: (error) => {
			console.error("Update failed:", error);
		},
	});
	const confirmUpdateFromExcel =
		api.bonus.confirmUpdateFromExcel.useMutation();

	const selectedFileIdx = () =>
		datas.findIndex((d) => d.name === selectedFile);

	function recoverObject(data: Array<any>) {
		return data.slice(1).map((d) => {
			return {
				period_id: d[1],
				bonus_type: d[2],
				emp_no: d[3],
				special_multiplier: d[4],
				multiplier: d[5],
				fixed_amount: d[6],
				bud_effective_salary: d[7],
				bud_amount: d[8],
				sup_performance_level: d[9],
				sup_effective_salary: d[10],
				sup_amount: d[11],
				app_performance_level: d[12],
				app_effective_salary: d[13],
				app_amount: d[14],
			};
		});
	}

	return <ExcelUpload onClick={(data) => {
				console.log("data", data);
				// Multi sheet: sheet_name -> Obj[]
				// Single sheet: Obj[]
				if (Array.isArray(data)) {
				}
			}}/>;
}
