import { injectable } from "tsyringe";
import {
	type AllowanceRange,
	type AllowanceRangeDecType,
	type decAllowanceRange,
	type encAllowanceRange,
} from "../entity/SALARY/allowance_range";
import { BaseMapper } from "./base_mapper";

@injectable()
export class AllowanceRangeMapper extends BaseMapper<
	AllowanceRange,
	AllowanceRangeDecType,
	typeof encAllowanceRange,
	typeof decAllowanceRange
> {}
