import { z } from "zod";
export interface keyDict {
	[key: string]: string[];
}

export function getExcelData(Alldatas: any[]) {
	const excelData: any[] = [];
	Alldatas.map((sheetDatas: { name: string; data: any[] }) => {
		const name: string = sheetDatas.name;
		try {
			const datas = sheetDatas.data;
			const columns = Object.keys(datas[0]).map(
				(key: string) =>
					// Translate(key)
					key,
			);
			const rows = datas.map((data: any, index: number) => {
				return Object.keys(data).map((key: string) => {
					return data[key];
				});
			});
			rows.unshift(columns);
			excelData.push({ sheetName: name, data: rows });
		} catch (e) {
			excelData.push({
				sheetName: name,
				data: [
					["test col 1", "test col 2"],
					[123, 456],
				],
			});
		}
	});
	return excelData;
}

export function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
	return Object.fromEntries(
		Object.entries(schema.shape as Record<string, any>).map(
			([key, value]) => {
				if (value instanceof z.ZodDefault)
					return [key, value._def.defaultValue()];
				return [key, undefined];
			},
		),
	);
}

export function getBonusExcel(data: any) {
	const frontend_data = data.map((d: any) => {
		return {
			id: d.id,
			period_id: d.period_id,
			bonus_type: d.bonus_type,
			department: d.department,
			emp_no: d.emp_no,
			emp_name: d.emp_name,
			residence_permit_start_date: d.residence_permit_start_date,
			residence_permit_end_date: d.residence_permit_end_date,
			registration_date: d.registration_date,
			quit_date: d.quit_date,
			seniority: d.seniority,
			positionAndPositionType: d.position_position_type,
			work_status: d.work_status,
			base_salary: d.base_salary,
			supervisor_allowance: d.supervisor_allowance,
			subsidy_allowance: d.subsidy_allowance,
			occupational_allowance: d.occupational_allowance,
			food_allowance: d.food_allowance,
			long_service_allowance: d.long_service_allowance,
			total: d.total,
			status: d.status,

			special_multiplier: d.special_multiplier,
			multiplier: d.multiplier,
			fixed_amount: d.fixed_amount,
			bud_effective_salary: d.bud_effective_salary,
			bud_amount: d.bud_amount,
			sup_performance_level: d.sup_performance_level,
			sup_effective_salary: d.sup_effective_salary,
			sup_amount: d.sup_amount,
			app_performance_level: d.app_performance_level,
			app_effective_salary: d.app_effective_salary,
			app_amount: d.app_amount,
		};
	});

	// Define the structure of your data objects
	interface DataItem {
		status: "符合資格" | "不符合資格" | "留停"; // Use union type for `status`
		// Other properties can go here
	}

	// Define your `order` object
	const order: Record<DataItem["status"], number> = {
		符合資格: 1,
		不符合資格: 2,
		留停: 3,
	};

	frontend_data.sort(
		(a: any, b: any) => (order as any)[a.status] - (order as any)[b.status],
	);

	const groupedByDepartment = frontend_data.reduce((acc: any, curr: any) => {
		const dept = curr.department.split("\n")[0].split("\r")[0];

		// 如果該部門的陣列不存在，先建立一個空陣列
		if (!acc[dept]) {
			acc[dept] = [];
		}

		// 將當前項目加入對應部門的陣列中
		acc[dept].push(curr);
		return acc;
	}, {});

	// 檢視結果
	console.log(groupedByDepartment);

	// 將部門資料轉換成 { department: ?, data: ? } 格式的陣列
	const transformedData = Object.entries(groupedByDepartment).map(
		([department, data]) => ({
			department,
			data,
			status_cnt: [
				(data as any).filter((d: any) => d.status === "符合資格")
					.length,
				(data as any).filter((d: any) => d.status === "不符合資格")
					.length,
				(data as any).filter((d: any) => d.status === "留停").length,
			],
		}),
	);

	const transformedData_add_all = [
		{
			department: "All",
			data: frontend_data,
			status_cnt: [
				frontend_data.filter((d: any) => d.status === "符合資格")
					.length,
				frontend_data.filter((d: any) => d.status === "不符合資格")
					.length,
				frontend_data.filter((d: any) => d.status === "留停").length,
			],
		},
	].concat(transformedData);

	const cleanedData = transformedData_add_all.map((item) => ({
		...item,
		data: item.data.map((d: any) => {
			const { status, ...rest } = d; // Destructure and exclude `status`
			return rest;
		}),
	}));

	console.log(cleanedData);

	return cleanedData;
}

// function createSchema() {
// 		const testData = getBonusExcel(getExcelA.data!).map((d: any) => {
// 			return { name: d.department, data: d.data };
// 		});
// 		const keys = getExcelA.isFetched
// 			? Object.keys(
// 					testData.map((sheet: any) => sheet.data[0])[
// 						selectedSheetIndex
// 					]
// 			  )
// 			: [];
// 		const schemaShape = keys.reduce((acc: any, key) => {
// 			if (toExcludedColumns.includes(key)) {
// 				acc[key] = z.boolean().optional().default(false);
// 			} else {
// 				acc[key] = z.boolean().optional().default(true);
// 			}
// 			return acc;
// 		}, {});
// 		const schema = z.object(schemaShape);
// 		return schema;
// 	}


// TODO: move, this should be a duplicated function
export function excludeDataColumn(dataList: any, excludedColumns: Array<string>) {
		interface keyValuePair {
			[key: string]: any;
		}
		const testDataList = dataList.map((d: any) => {
			return {
				name: d.department,
				data: d.data,
				status_cnt: d.status_cnt,
			};
		});
		return testDataList.map((data: any) => {
			const sheetName = data.name;
			const sheetData = data.data.map((row: keyValuePair) => {
				const newRow: keyValuePair = {};
				Object.keys(row).forEach((key) => {
					if (!excludedColumns.includes(key)) {
						newRow[key] = row[key];
					}
				});
				return newRow;
			});
			return {
				name: sheetName,
				data: sheetData,
				status_cnt: data.status_cnt,
			};
		});
	}
