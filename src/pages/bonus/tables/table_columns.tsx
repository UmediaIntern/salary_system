import { type ColumnDef } from "@tanstack/react-table";
import {
	bonusDepartmentMapper,
	bonus_department_columns,
} from "./bonus_department_table";
import {
	bonusPositionMapper,
	bonus_position_columns,
} from "./bonus_position_table";
import {
	bonusPositionTypeMapper,
	bonus_position_type_columns,
} from "./bonus_position_type_table";
import {
	bonusSeniorityMapper,
	bonus_seniority_columns,
} from "./bonus_seniority_table";
import { type TFunction } from "i18next";
import { BonusTableEnum } from "../bonus_tables";
import { bonus_work_type_columns, bonusWorkTypeMapper } from "./bonus_work_type_table";
import { bonus_all_columns, bonusAllMapper } from "./bonus_all_table";

export function getTableColumn(
	selectedTableType: BonusTableEnum,
	t: TFunction<[string], undefined>
): ColumnDef<any, any>[] {
	switch (selectedTableType) {
		case "TableBonusAll":
			return bonus_all_columns({ t });
		case "TableBonusWorkType":
			return bonus_work_type_columns({ t });
		case "TableBonusDepartment":
			return bonus_department_columns({ t });
		case "TableBonusPosition":
			return bonus_position_columns({ t });
		// case "TableBonusPositionType":
		// 	return bonus_position_type_columns;
		case "TableBonusSeniority":
			return bonus_seniority_columns({ t });
		// case "TableBonusSetting":
		// 	return bonus_columns;
		// case "TablePerformanceLevel":
		// 	return performance_level_columns;
	}
}

export function getTableMapper(selectedTableType: BonusTableEnum) {
	switch (selectedTableType) {
		case "TableBonusAll":
			return bonusAllMapper;
		case "TableBonusWorkType":
			return bonusWorkTypeMapper;
		case "TableBonusDepartment":
			return bonusDepartmentMapper;
		case "TableBonusPosition":
			return bonusPositionMapper;
		// case "TableBonusPositionType":
		// 	return bonusPositionTypeMapper;
		case "TableBonusSeniority":
			return bonusSeniorityMapper;
		// case "TableBonusSetting":
		// 	return bonusMapper;
		// case "TablePerformanceLevel":
		// 	return performaceLevelMapper;
	}
}
