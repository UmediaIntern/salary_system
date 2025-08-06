import { container, injectable } from "tsyringe";
import { AllowanceRangeMapper } from "../database/mapper/allowance_range_mapper";
import { createAllowanceRangeService } from "../api/types/allowance_range_type";
import { AllowanceRange, AllowanceRangeDecType } from "../database/entity/SALARY/allowance_range";
import { z } from "zod";
import { AllowanceTypeEnumType } from "../api/types/allowance_type_enum";
import { EmployeeDataDecType } from "../database/entity/SALARY/employee_data";
import { EHRService } from "./ehr_service";
import { dateToString } from "../api/types/z_utils";
import { Op } from "sequelize";

@injectable()
export class AllowanceRangeService {
	constructor(private readonly allowanceRangeMapper: AllowanceRangeMapper,
		readonly ehrService: EHRService
	) { }
	async createAllowanceRange(data: z.infer<typeof createAllowanceRangeService>) {
		const result = createAllowanceRangeService.safeParse(data);
		if (!result.success) {
			throw new Error(result.error.message);
		}
		const d = result.data;
		const allowance_range = await this.allowanceRangeMapper.encode({
			...d,
			start_date: d.start_date ?? new Date(),
			create_by: "system",
			update_by: "system",
			disabled: false
		});
		const db_newData = await AllowanceRange.create(allowance_range, {
			raw: true,
		});
		return await this.allowanceRangeMapper.decode(
			db_newData,
		)
	}
	async getCurrentAllowanceRange(period_id: number): Promise<AllowanceRangeDecType[]> {
		const period = await this.ehrService.getPeriodById(period_id);
		const current_date_string = dateToString.parse(period.end_date);
		const allowance_range = await AllowanceRange.findAll({
			where: {
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
				disabled: false,
			},
			raw: true,
		});
		const allowance_range_list = await this.allowanceRangeMapper.decodeList(allowance_range);
		return allowance_range_list;
	}
	
	// async getMatchedAllowance(period_id: number,employee_data: EmployeeDataDecType,allowance_type:AllowanceTypeEnumType) {
	// 	const period = await this.ehrService.getPeriodById(period_id);
	// 	const current_date_string = dateToString.parse(period.end_date);
	// 	const allowance_range = await AllowanceRange.findOne({
	// 		where: {
	// 			position: employee_data.position,
	// 			allowance_type: allowance_type,
	// 			start_date: {
	// 				[Op.lte]: current_date_string,
	// 			},
	// 			end_date: {
	// 				[Op.or]: [
	// 					{ [Op.gte]: current_date_string },
	// 					{ [Op.eq]: null },
	// 				],
	// 			},
	// 			disabled: false,
	// 		},
	// 		raw: true,
	// 	});
	// 	return await this.allowanceRangeMapper.decode(allowance_range);
	// }
	async checkAllowanceInRange(cur_allowance_range: AllowanceRangeDecType[], employee_data: EmployeeDataDecType, allowance_type: AllowanceTypeEnumType, amount: number) {
		const allowance_range = cur_allowance_range.find((v) => v.allowance_type === allowance_type && v.position === employee_data.position && v.position_type === employee_data.position_type);
		if (!allowance_range || (allowance_range.allowance_start <= amount && allowance_range.allowance_end >= amount)) {
			return true;
		}
		return false;
	}
}
