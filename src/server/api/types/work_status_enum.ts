import { z } from "zod";

export const WorkStatusEnum = z.enum([
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
export type WorkStatusEnumType = z.infer<typeof WorkStatusEnum>;
