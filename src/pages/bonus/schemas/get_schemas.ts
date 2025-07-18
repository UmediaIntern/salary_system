import { type TableEnum } from "../components/context/data_table_enum";
import { bonusAllSchema } from "./configurations/bonus_all_schema";
import { bonusDepartmentSchema } from "./configurations/bonus_department_schema";
import { bonusPositionAndPositionTypeSchema } from "./configurations/bonus_position_and_position_type_schema";
import { bonusPositionSchema } from "./configurations/bonus_position_schema";
import { bonusPositionTypeSchema } from "./configurations/bonus_position_type_schema";
import { bonusSenioritySchema } from "./configurations/bonus_seniority_schema";
import { bonusWorkTypeSchema } from "./configurations/bonus_work_type";
import { employeeBonusSchema } from "./configurations/employee_bonus_schema";

export function getSchema(table: TableEnum) {
	switch (table) {
		// bonus
		// case "TableBonusSetting":
		// 	return bonusSchema;
		case "TableBonusAll":
			return bonusAllSchema;
		case "TableBonusWorkType":
			return bonusWorkTypeSchema;
		case "TableBonusDepartment":
			return bonusDepartmentSchema;
		case "TableBonusPosition":
			return bonusPositionSchema;
		// case "TableBonusPositionType":
		// 	return bonusPositionTypeSchema;
		case "TableBonusSeniority":
			return bonusSenioritySchema;
		case "TableEmployeeBonus":
			return employeeBonusSchema;
		// level
		// case "TablePerformanceLevel":
		// 	return performanceLevelSchema;

	


		default:
			// console.log(`Table ${table} not found`);	
			throw Error(`Table ${table} not found`);
	}
}
