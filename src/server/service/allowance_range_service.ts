import { container, injectable } from "tsyringe";
import { AllowanceRangeMapper } from "../database/mapper/allowance_range_mapper";

@injectable()
export class AllowanceRangeService {
	constructor(private readonly allowanceRangeMapper: AllowanceRangeMapper) {}

}
