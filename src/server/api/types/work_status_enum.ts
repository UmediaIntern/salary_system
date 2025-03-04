import { z } from "zod";

export const WorkStatusEnum = z.enum([
	"RegularEmployee",
	"ResignedEmployee",
	"ForeignWorker",
	"ResignedEmployeePartialMonth",
	"ResignedEmployeeFullMonth",
	"NewEmployeePartialMonth",
	"NewEmployeeFullMonth",
	"GeneralManager",
	"Consultant",
	"NewEmployee",
	"PartTimeWorker",
	"Intern",
	"ContractEmployee",
	"DailyWage",
]);
export type WorkStatusEnumType = z.infer<typeof WorkStatusEnum>;

export const DBWorkStatusEnum = z.enum([
	"一般員工",
	"離職人員",
	"外籍勞工",
	"當月離職人員破月",
	"當月離職人員全月",
	"當月新進人員破月",
	"當月新進人員全月",
	"總經理",
	"顧問",
	"當月新進人員",
	"工讀生",
	"建教生",
	"約聘人員",
	"日薪制",
]);
export type DBWorkStatusEnumType = z.infer<typeof DBWorkStatusEnum>;


const workStatusMapping: Record<WorkStatusEnumType, DBWorkStatusEnumType> = {
    RegularEmployee: "一般員工",
    ResignedEmployee: "離職人員",
    ForeignWorker: "外籍勞工",
    ResignedEmployeePartialMonth: "當月離職人員破月",
    ResignedEmployeeFullMonth: "當月離職人員全月",
    NewEmployeePartialMonth: "當月新進人員破月",
    NewEmployeeFullMonth: "當月新進人員全月",
    GeneralManager: "總經理",
    Consultant: "顧問",
    NewEmployee: "當月新進人員",
    PartTimeWorker: "工讀生",
    Intern: "建教生",
    ContractEmployee: "約聘人員",
    DailyWage: "日薪制",
};

export function convertToDBWorkStatusEnum(status: WorkStatusEnumType): DBWorkStatusEnumType {
    return workStatusMapping[status];
}

export function convertFromDBWorkStatusEnum(status: DBWorkStatusEnumType): WorkStatusEnumType {
	for (const [key, value] of Object.entries(workStatusMapping)) {
		if (value === status) {
			return key as WorkStatusEnumType;
		}
	}
	throw new Error(`Unknown work status: ${status}`);
}