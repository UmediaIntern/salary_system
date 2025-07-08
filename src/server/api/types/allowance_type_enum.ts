import { z } from "zod";

export const allowanceTypeEnum = z.enum([
  "supervisor_allowance",
  "occupational_allowance",
  "long_service_allowance",
  "subsidy_allowance",
  "food_allowance",
]);

export type AllowanceTypeEnumType = z.infer<typeof allowanceTypeEnum>;

export function convertToKey(type: AllowanceTypeEnumType): string {
	return type.toLowerCase();
}

