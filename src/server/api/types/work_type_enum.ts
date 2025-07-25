import { z } from "zod";

export const workTypeEnum = z.enum(["DirectEmployee", "IndirectEmployee", "ForeignWorker"])
export type WorkTypeEnumType = z.infer<typeof workTypeEnum>;

export const DBWorkTypeEnum = z.enum(["直接人員", "間接人員", "外籍勞工"]);
export type DBWorkTypeEnumType = z.infer<typeof DBWorkTypeEnum>;

const workTypeMapping: Record<WorkTypeEnumType, DBWorkTypeEnumType> = {
    DirectEmployee: "直接人員",
    IndirectEmployee: "間接人員",
    ForeignWorker: "外籍勞工",
};

export function convertToDBWorkTypeEnum(workType: WorkTypeEnumType): DBWorkTypeEnumType {
    return workTypeMapping[workType];
}

export function convertFromDBWorkTypeEnum(workType: DBWorkTypeEnumType): WorkTypeEnumType {
    for (const [key, value] of Object.entries(workTypeMapping)) {
		if (value === workType) {
			return key as WorkTypeEnumType;
		}
	}
	throw new Error(`Unknown work type: ${workType}`);
}

export function convertToKey(status: WorkTypeEnumType): string {
    return status
        .replace(/([a-z])([A-Z])/g, "$1_$2") // Insert underscore between lowercase and uppercase
        .toLowerCase(); // Convert the whole string to lowercase
}
