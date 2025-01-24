/*
	Known Bugs:
		超時加班不確定overtime 的type name (現在是 "超時加班")
		Labor Insurance Deduction:	old_age_benefit doesn't know where, so its logic is commented
		GS: 假解: 強制轉型 (之後要重啟DB check occupational_allowance的type)

*/
import { container, injectable } from "tsyringe";
import { EmployeeDataDecType } from "../database/entity/SALARY/employee_data";
import { ExpenseWithType } from "./ehr_service";
import { Overtime } from "../database/entity/UMEDIA/overtime";
import { Payset } from "../database/entity/UMEDIA/payset";
import {
	InsuranceRateSettingDecType,
} from "../database/entity/SALARY/insurance_rate_setting";
import { Holiday } from "../database/entity/UMEDIA/holiday";
import { PayTypeEnum, PayTypeEnumType } from "../api/types/pay_type_enum";
import { HolidaysType } from "../database/entity/SALARY/holidays_type";
import { Floor, Round } from "./helper_function";
import { bonusTypeEnum } from "../api/types/bonus_type_enum";
import { EmployeeBonusService } from "./employee_bonus_service";
import { LongServiceEnum } from "../api/types/long_service_enum";
import { Expense } from "../database/entity/UMEDIA/expense";
import { AllowanceType } from "../database/entity/UMEDIA/allowance_type";
import { ExpenseClass } from "../database/entity/UMEDIA/expense_class";
import { EmployeePaymentFEType } from "../api/types/employee_payment_type";
import { Bonus } from "../database/entity/UMEDIA/bonus";
import { BonusType } from "../database/entity/UMEDIA/bonus_type";
import { SalaryIncomeTaxDecType } from "../database/entity/SALARY/salary_income_tax";

const FOREIGN = "外籍勞工";
const PROFESSOR = "顧問";
const BOSS = "總經理";
const DAY_PAY = "日薪制";
const NEWBIE = "當月新進人員";
const WILL_LEAVE = "當月離職人員破月";
const LEAVE_MAN = "離職人員";
const PARTTIME1 = "工讀生";
const PARTTIME2 = "建教生";
const CONTRACT = "約聘人員";
const NORMAL_MAN = "一般員工";
const rd = (key: string) => {
	throw new Error("Should change 'rd' to your functions");
};
@injectable()
export class CalculateService {
	constructor() { }

	// MARK: 平日加班費
	async getWeekdayOvertimePay(
		employee_data: EmployeeDataDecType,
		discounted_employee_payment_dec: EmployeePaymentFEType,
		overtime_list: Overtime[],
		payset: Payset,
		insurance_rate_setting: InsuranceRateSettingDecType,
		full_attendance_bonus: number,
		pay_type: PayTypeEnumType,
		shift_allowance: number,
		gross_salary: number,
		professional_cert_allowance: number
	): Promise<number> {
		/*
				平日加班費 = GetNormalMoney(
					工作類別,
					工作形態,
					應發底薪+全勤獎金+輪班津貼+專業証照津貼,
					加班1_時數,
					加班2_時數
				)
		*/
		// 不確定專業證照津貼要不要加兩次
		let pay = 1; // 1 五日 2 15日
		if (pay_type === PayTypeEnum.enum.foreign_15_bonus) {
			pay = 2;
		}
		// const gross_salary = await this.getGrossSalary(employee_payment, payset);
		// const shift_allowance = employee_payment.shift_allowance ?? 0;
		let hourly_fee =
			(gross_salary +
				shift_allowance +
				full_attendance_bonus +
				professional_cert_allowance) /
			240;
		// let t1 = 0;
		let t2 = 0;
		let t3 = 0;
		let t4 = 0;
		let t5 = 0;
		overtime_list.map((overtime) => {
			if (overtime.type_name === "平日" && overtime.pay === pay) {
				// t1 += overtime.hours_1 ?? 0;
				t2 += overtime.hours_134 ?? 0;
				t3 += overtime.hours_167 ?? 0;
				t4 += overtime.hours_2 ?? 0;
				t5 += overtime.hours_267 ?? 0;
			}
		});

		if (employee_data.work_type === FOREIGN) {
			hourly_fee = Floor(insurance_rate_setting.min_wage / 240, 2);
			return Round(
				// hourly_fee * t1 +
				hourly_fee * t2 * 1.34 +
				hourly_fee * t3 * 1.67 +
				hourly_fee * t4 * 2 +
				hourly_fee * t5 * 2.67
			);
		} else
			return Round(
				// hourly_fee * t1 +
				hourly_fee * t2 * 1.34 +
				hourly_fee * t3 * 1.67 +
				hourly_fee * t4 * 2 +
				hourly_fee * t5 * 2.67
			);
	}
	//MARK: 假日加班費
	async getHolidayOvertimePay(
		employee_data: EmployeeDataDecType,
		discounted_employee_payment_dec: EmployeePaymentFEType,
		overtime_list: Overtime[],
		payset: Payset,
		insurance_rate_setting: InsuranceRateSettingDecType,
		full_attendance_bonus: number,
		pay_type: PayTypeEnumType,
		shift_allowance: number,
		gross_salary: number,
		professional_cert_allowance: number
	): Promise<number> {
		/*
			假日加班費 = GetVocationMoney(
					工作類別,
					工作形態,
					應發底薪+全勤獎金+輪班津貼+專業証照津貼,
					假日加班時數+國加班0_時數+例加班0_時數+例假日加班_時數,
					休加班1_時數+國加班1_時數,
					休加班2_時數+國加班2_時數,
					休加班3_時數
			)
		*/
		let pay = 1; // 1 五日 2 15日
		if (pay_type === PayTypeEnum.enum.foreign_15_bonus) {
			pay = 2;
		}
		// const gross_salary = await this.getGrossSalary(employee_payment, payset);
		// const shift_allowance = employee_payment.shift_allowance ?? 0;
		let hourly_fee =
			(gross_salary +
				shift_allowance +
				full_attendance_bonus +
				professional_cert_allowance) /
			240;
		let t1 = 0;
		let t2 = 0;
		let t3 = 0;
		let t4 = 0;
		let t5 = 0;
		overtime_list.map((overtime) => {
			if (overtime.pay === pay) {
				t1 += overtime.hours_1 ?? 0;
				// t2 += overtime.hours_134 ?? 0;
				// t3 += overtime.hours_167 ?? 0;
				// t4 += overtime.hours_2 ?? 0;
				// t5 += overtime.hours_267 ?? 0;
			}
		});
		// rate存哪裡？
		if (employee_data.work_type === FOREIGN) {
			hourly_fee = Floor(insurance_rate_setting.min_wage / 240, 2);
			return Round(
				hourly_fee * t1 //+
				// hourly_fee * t2 * 1.34 +
				// hourly_fee * t3 * 1.67 +
				// hourly_fee * t4 * 2 +
				// hourly_fee * t5 * 2.67
			);
		} else
			return Round(
				hourly_fee * t1 //+
				// hourly_fee * t2 * 1.34 +
				// hourly_fee * t3 * 1.67 +
				// hourly_fee * t4 * 2 +
				// hourly_fee * t5 * 2.67
			);
	}

	// MARK: 超時加班費
	async getExceedOvertimePay(
		employee_data: EmployeeDataDecType,
		discounted_employee_payment_dec: EmployeePaymentFEType,
		overtime_list: Overtime[],
		payset: Payset,
		insurance_rate_setting: InsuranceRateSettingDecType,
		full_attendance_bonus: number,
		pay_type: PayTypeEnumType,
		shift_allowance: number,
		gross_salary: number,
		professional_cert_allowance: number
	): Promise<number> {
		/*
				超時加班 = GetOverTimeMoney(
					工作類別,
					工作形態,
					應發底薪+全勤獎金+輪班津貼+專業証照津貼,
					加班稅1_時數+休加班稅1_時數+國加班稅1_時數,
					加班稅2_時數+休加班稅2_時數+國加班稅2_時數,
					例假日加班稅_時數,
					休加班稅3_時數
				)
		*/
		let pay = 1; // 1 五日 2 15日
		if (pay_type === PayTypeEnum.enum.foreign_15_bonus) {
			pay = 2;
		}
		// const money = await this.getGrossSalary(employee_payment, payset);
		// const shift_allowance = employee_payment.shift_allowance ?? 0;
		let hourly_fee =
			(gross_salary +
				shift_allowance +
				full_attendance_bonus +
				professional_cert_allowance) /
			240;
		let t1 = 0;
		let t2 = 0;
		let t3 = 0;
		let t4 = 0;
		overtime_list.map((overtime) => {
			if (overtime.pay === pay) {
				//不確定名字
				t1 += overtime.hours_134_TAX ?? 0;
				t2 += overtime.hours_167_TAX ?? 0;
				t3 += overtime.hours_2_TAX ?? 0;
				t4 += overtime.hours_267_TAX ?? 0;
			}
		});
		// rate存哪裡？
		if (employee_data.work_type === FOREIGN || employee_data.work_status === FOREIGN) {
			hourly_fee = Floor(insurance_rate_setting.min_wage / 240, 2);
			return Round(
				hourly_fee * t1 * 1.34 +
				hourly_fee * t2 * 1.67 +
				hourly_fee * t3 * 2 +
				hourly_fee * t4 * 2.67
			);
		} else
			return Round(
				hourly_fee * t1 * 1.34 +
				hourly_fee * t2 * 1.67 +
				hourly_fee * t3 * 2 +
				hourly_fee * t4 * 2.67
			);
	}
	//MARK: 應發底薪
	async getGrossSalary(
		employee_payment_dec: EmployeePaymentFEType,
		payset: Payset,
		professional_cert_allowance: number,
		pay_type: PayTypeEnumType,
		full_attendance_bonus: number,
		employee_data: EmployeeDataDecType,
		operational_performance_bonus: number
	): Promise<number> {
		// F底薪＋伙食津貼＋營運績效獎金＋全勤獎金
		// U底薪＋伙食津貼＋主管津貼＋職務津貼＋補助津貼
		if (employee_data.work_type === FOREIGN || employee_data.work_status === FOREIGN) {
			if (pay_type === PayTypeEnum.enum.foreign_15_bonus) {
				return (
					employee_payment_dec.base_salary +
					(employee_payment_dec.food_allowance ?? 0) +
					operational_performance_bonus
				);
			} else {
				return (
					employee_payment_dec.base_salary +
					(employee_payment_dec.food_allowance ?? 0) +
					full_attendance_bonus
				);
			}
		} else {
			const gross_salary =
				employee_payment_dec.base_salary +
				(employee_payment_dec.food_allowance ?? 0) +
				(employee_payment_dec.supervisor_allowance ?? 0) +
				(employee_payment_dec.occupational_allowance ?? 0) +
				(employee_payment_dec.subsidy_allowance ?? 0) +
				(employee_payment_dec.long_service_allowance_type ==
					LongServiceEnum.enum.month_allowance
					? employee_payment_dec.long_service_allowance
					: 0);
			return gross_salary;
		}
	}
	//MARK: 勞保扣除額
	async getLaborInsuranceDeduction(
		employee_data: EmployeeDataDecType,
		discounted_employee_payment_dec: EmployeePaymentFEType,
		payset: Payset,
		insuranceRateSetting: InsuranceRateSettingDecType
	): Promise<number> {
		// rd("勞保扣除額") = CalacWorkTex(rd("勞保"), CheckNull(rd("工作天數"), 30), CheckNull(rd("勞保天數"), 30), rd("工作類別"), rd("工作形態"), CheckNull(rd("殘障等級"), "正常"), CheckNull(rd("勞保追加"), 30), rd("已領老年給付")) 'Jerry 07/03/30 加入殘障等級計算, 07/11/26 增加勞保追加計算,10/04/26增加"已領老年給付"判斷
		// Tax: rd("勞保")
		// Normalday: CheckNull(rd("工作天數"), 30)
		// PartTimeDay: CheckNull(rd("勞保天數"), 30)
		// kind1: rd("工作類別")
		// kind2: rd("工作形態")
		// hinder: CheckNull(rd("殘障等級"), "正常")
		// Work_type: rd("已領老年給付")

		const wci_normal = insuranceRateSetting.l_i_accident_rate; // 勞工保險普通事故險
		const wci_ji = insuranceRateSetting.l_i_employment_pay_rate; // 勞工保險就業保險率

		const hinderDict: { [key: string]: number } = {
			正常: 1,
			輕度: 0.75,
			中度: 0.5,
			重度: 0,
		};

		const Tax = discounted_employee_payment_dec.l_i;
		const Normalday = payset ? payset.work_day : 30;
		const PartTimeDay = payset ? payset.li_day! : 30;
		const kind1 = employee_data.work_type;
		const kind2 = employee_data.work_status;
		const hinder_rate =
			hinderDict[employee_data.disabilty_level ?? "正常"] ?? 1;
		const old_age_benefit = true || false; //employee_data.received_elderly_benefits;		// old_age_benefit: rd("已領老年給付")

		// if (old_age_benefit)	return 0;	// 'Jerry 100426 已領老年給付者,員工免付勞保

		if (kind1 === FOREIGN || kind2 === FOREIGN)
			return Round(
				Round((Tax * wci_normal * 0.200001 * PartTimeDay) / 30) *
				hinder_rate
			); // 'Jerry 2023/04/06 由工作天數改為加勞保天數計算
		if (kind2 === PROFESSOR) return 0;
		if (kind2 === BOSS)
			return (
				Round(Round((Tax * wci_normal * 0.200001 * PartTimeDay) / 30)) *
				hinder_rate
			); //   'Jerry 10/04/26 由工作天數改為加勞保天數計算
		if (kind2 === DAY_PAY)
			return (
				Round(
					Round((Tax * wci_normal * 0.200001 * PartTimeDay) / 30) +
					Round((Tax * wci_ji * 0.200001 * PartTimeDay) / 30)
				) * hinder_rate
			);
		if (
			kind2 === NEWBIE ||
			kind2 === WILL_LEAVE ||
			kind2 === PARTTIME1 ||
			kind2 === PARTTIME2 ||
			kind2 == CONTRACT
		)
			return (
				Round(
					Round((Tax * wci_normal * 0.200001 * PartTimeDay) / 30) +
					Round((Tax * wci_ji * 0.200001 * PartTimeDay) / 30)
				) * hinder_rate
			); // 'Jerry 07/07/19 由工作天數改為加勞保天數計算

		return (
			Round(
				Round(Tax * wci_normal * 0.200001) +
				Round(Tax * wci_ji * 0.200001)
			) * hinder_rate
		);
	}
	//MARK: 健保扣除額(要多考慮本人障礙 眷屬正常)
	async getHealthInsuranceDeduction(
		employee_data: EmployeeDataDecType,
		discounted_employee_payment_dec: EmployeePaymentFEType,
		insurance_rate_setting: InsuranceRateSettingDecType
	): Promise<number> {
		// rd("健保扣除額") = CalacHelTax(rd("健保"), rd("健保眷口數"), rd("工作形態"), CheckNull(rd("殘障等級"), "正常"), 0, rd("健保追加"))   'Jerry 07/03/30 加入殘障等級計算  , 07/11/26 增加健保追加計算
		let Tax: number = discounted_employee_payment_dec.h_i;
		let Peop: number = employee_data.healthcare_dependents ?? 0;
		let kind: string = employee_data.work_status;
		const hinder: string = employee_data.disabilty_level ?? "正常";
		let exePep: number = 0;
		let HelAdd_YN: boolean = false; // 建保追加 => 似乎bang不見了

		if (Peop > 3) Peop = 3;

		let hinder_rate: number = 1;
		if (hinder == "正常") hinder_rate = 1;
		if (hinder == "輕度") hinder_rate = 0.75;
		if (hinder == "中度") hinder_rate = 0.5;
		if (hinder == "重度") hinder_rate = 0;

		const nhi_rate = insurance_rate_setting.h_i_standard_rate; // 健保一般保費費率 : 應該是這個

		if (HelAdd_YN) {
			if (kind === LEAVE_MAN || kind === PROFESSOR || kind === WILL_LEAVE)
				return 0;
			if (kind === BOSS)
				return (
					(Round(Round(Tax * nhi_rate) * (Peop + 1)) +
						Round(Round(Tax * nhi_rate) * exePep)) *
					hinder_rate *
					2
				);
			return (
				(Round(Round(Tax * nhi_rate * 0.3) * (Peop + 1)) +
					Round(Round(Tax * nhi_rate * 0.3) * exePep)) *
				hinder_rate *
				2
			);
		} else {
			// HelAdd_YN = False	=> 		不追加健保
			if (kind === LEAVE_MAN || kind === PROFESSOR || kind === WILL_LEAVE)
				return 0;
			if (kind === BOSS)
				return (
					(Round(Round(Tax * nhi_rate) * (Peop + 1)) +
						Round(Round(Tax * nhi_rate) * exePep)) *
					hinder_rate
				);
			return (
				(Round(Tax * nhi_rate * 0.3) * (Peop + 1) +
					Round(Tax * nhi_rate * 0.3) * exePep) *
				hinder_rate
			);
		}

		return 0;
	}
	//MARK:福利金提撥
	async getWelfareContribution(
		employee_data: EmployeeDataDecType,
		discounted_employee_payment_dec: EmployeePaymentFEType,
		full_attendance_bonus: number,
		operational_performance_bonus: number
	): Promise<number> {
		// rd("福利金提撥") = GetFooMoney(rd("工作類別"), rd("工作形態"), rd("底薪"), rd("伙食津貼"), CheckNull(rd("營運積效獎金"), 0), CheckNull(rd("全勤獎金"), 0))
		const kind1 = employee_data.work_type;
		const kind2 = employee_data.work_status;
		const money = discounted_employee_payment_dec.base_salary;
		const food = discounted_employee_payment_dec.food_allowance ?? 0;
		const Effect = operational_performance_bonus ?? 0;
		const Fulltime = full_attendance_bonus ?? 0;

		if (kind1 === FOREIGN || kind2 === FOREIGN)
			return Round((money + food + Effect + Fulltime) * 0.005);
		if (kind2 === LEAVE_MAN) return 0;
		if (kind2 === PROFESSOR) return 0;
		if (kind2 === PARTTIME1) return 0;
		if (kind2 === PARTTIME2) return 0;
		if (kind2 === CONTRACT) return 0;
		if (kind2 === DAY_PAY) return 0;

		return Round((money + food) * 0.005);
	}
	//MARK: 請假扣款
	async getLeaveDeduction(
		employee_data: EmployeeDataDecType,
		holiday_list: Holiday[], // Maybe not this
		holidays_type: HolidaysType[],
		insurance_rate_setting: InsuranceRateSettingDecType,
		full_attendance_bonus: number,
		shift_allowance: number,
		gross_salary: number,
		professional_cert_allowance: number
	): Promise<number> {
		// UPDATE 薪資查詢 SET 薪資查詢.請假扣款 = GetLeaveMoney(薪資查詢!工作類別,薪資查詢!工作形態,薪資查詢!應發底薪,薪資查詢!補助津貼+薪資查詢!輪班津貼+薪資查詢!全勤獎金+薪資查詢!專業証照津貼,薪資查詢!事假時數,薪資查詢!病假時數)
		// 薪資查詢.不休假代金 = IIf(薪資查詢!工作類別="外籍勞工",round(GetSALARY_RATE()*(薪資查詢!不休假時數*Getnon_leaving_rate()+薪資查詢!不休假補休1時數*Getnon_leaving_rate1()+薪資查詢!不休假補休2時數*Getnon_leaving_rate2()+薪資查詢!不休假補休3時數*Getnon_leaving_rate3()+薪資查詢!不休假補休4時數*Getnon_leaving_rate4()+薪資查詢!不休假補休5時數*Getnon_leaving_rate5()),0),round(薪資查詢!應發底薪/240*(薪資查詢!不休假時數*Getnon_leaving_rate()+薪資查詢!不休假補休1時數*Getnon_leaving_rate1()+薪資查詢!不休假補休2時數*Getnon_leaving_rate2()+薪資查詢!不休假補休3時數*Getnon_leaving_rate3()+薪資查詢!不休假補休4時數*Getnon_leaving_rate4()+薪資查詢!不休假補休5時數*Getnon_leaving_rate5()),0));
		// const kind1 = employee_data.work_type;
		// const kind2 = employee_data.work_status;
		// const gross_salary = await this.getGrossSalary(employee_payment, payset);
		// const shift_allowance = employee_payment.shift_allowance ?? 0;
		let hourly_fee =
			(gross_salary +
				shift_allowance +
				full_attendance_bonus +
				professional_cert_allowance) /
			240;
		interface HolidaysTypeDict {
			[key: number]: number;
		}
		const special_personal_leave_id = holidays_type.find(
			(ht) => ht.holidays_name === "特別事假"
		)?.pay_id;
		let holidays_type_dict: HolidaysTypeDict = {};
		holidays_type.map((h: HolidaysType) => {
			holidays_type_dict[h.pay_id] = h.multiplier;
			if (h.pay_type === 1) {
				holidays_type_dict[h.pay_id]! = 0;
			}
		});
		let leave_deduction = 0;
		holiday_list.forEach((holiday) => {
			if (holiday.pay_order === special_personal_leave_id) return;
			leave_deduction +=
				(holiday.total_hours ?? 0) *
				holidays_type_dict[holiday.pay_order!]!;
		});
		if (employee_data.work_type === FOREIGN || employee_data.work_status === FOREIGN) {
			hourly_fee = Floor(insurance_rate_setting.min_wage / 240, 2);
			return Round(hourly_fee * leave_deduction);
		} else {
			return Round(hourly_fee * leave_deduction);
		}
		// const bonus = rd("補助津貼") + rd("輪班津貼") + rd("全勤獎金") + rd("專業証照津貼");
		// const t1 = rd("事假時數"); // 事假時數
		// const T2 = rd("病假時數"); // 病假時數

		// const SALARY_RATE = rd("最低工資率");		// 最低工資率
		// if (kind1 === FOREIGN)	return Math.round(SALARY_RATE * t1 + SALARY_RATE / 2 * T2);
		// if (kind2 === LEAVE_MAN)	return 0;
		// if (kind2 === FOREIGN)	return Math.round(SALARY_RATE * t1 + SALARY_RATE / 2 * T2);
		// return Math.round((money + bonus) / 240 * t1 + (money + bonus) / 240 * T2 / 2);
	}
	async getNote(): Promise<string> {
		return "";
	}
	//MARK: 全勤獎金
	async getFullAttendanceBonus(
		bonus_list: Bonus[],
		bonus_type_list: BonusType[],
	): Promise<number> {
		const full_attendance_bonus_id = bonus_type_list.find(
			(bt) => bt.name === "全勤獎金"
		)?.id!;
		let full_attendance_bonus = 0;
		for (const bonus of bonus_list) {
			if (bonus.bonus_id === full_attendance_bonus_id) {
				full_attendance_bonus += bonus.amount ?? 0;
			}
		}
		return full_attendance_bonus;
	}
	//MARK: 團保費代扣
	async getGroupInsuranceDeduction(
		expense_list: Expense[],
		expense_class_list: ExpenseClass[]
	): Promise<number> {
		// 在"其他"這張表裡面
		const expenseList = expense_list.filter((e) => e.kind === 2);
		const group_insurance_deduction_ids = expense_class_list
			.filter((ec) => ec.name === "團保費代扣" || ec.name === "團保代扣-眷屬")
			.map((ec) => ec.id!);
		let group_insurance_deduction = 0;
		for (const expense of expenseList) {
			if (group_insurance_deduction_ids.includes(expense.id!)) {
				group_insurance_deduction += expense.amount ?? 0;
			}
		}
		return group_insurance_deduction;
	}
	//MARK: 補發薪資
	async getReissueSalary(
		expense_list: Expense[],
		expense_class_list: ExpenseClass[]
	): Promise<number> {
		// 在"其他"這張表裡面
		const expenseList = expense_list.filter((e) => e.kind === 2);
		const reissue_salary_id = expense_class_list.find((ec) => ec.name === "補發薪資")?.id!;
		let reissue_salary = 0;
		for (const expense of expenseList) {
			if (expense.id === reissue_salary_id) {
				reissue_salary += expense.amount ?? 0;
			}
		}
		return reissue_salary;
	}
	//MARK: 年終獎金
	async getYearEndBonus(
		bonus_list: Bonus[],
		bonus_type_list: BonusType[],
	): Promise<number> {
		// 		=======年終獎金計算=========090121

		//         If PayType = YearEnd_Pay Then
		//            If rd("端午獎金") > 0 And rd("中秋獎金") > 0 And rd("試用期滿") = True Then       '端午,中秋皆發
		//               rd("年終獎金") = rd("年度在職天數") / 365 * (rd("底薪") + rd("伙食津貼") + rd("主管津貼") + rd("職務津貼") + rd("補助津貼")) * rd("獎金比率") - _
		//                                (1 - (rd("年度在職天數") / 365)) * (rd("底薪") + rd("伙食津貼") + rd("主管津貼") + rd("專業証照津貼") + rd("職務津貼") + rd("補助津貼")) * 1

		//            ElseIf rd("端午獎金") = 0 And rd("中秋獎金") > 0 And rd("試用期滿") = True Then    '端午沒發,中秋皆發
		//               rd("年終獎金") = rd("年度在職天數") / 365 * (rd("底薪") + rd("伙食津貼") + rd("主管津貼") + rd("專業証照津貼") + rd("職務津貼") + rd("補助津貼")) * rd("獎金比率") + _
		//                                rd("年度在職天數") / 365 * (rd("底薪") + rd("伙食津貼") + rd("主管津貼") + rd("專業証照津貼") + rd("職務津貼") + rd("補助津貼")) * 0.5 - _
		//                                (1 - (rd("年度在職天數") / 365)) * (rd("底薪") + rd("伙食津貼") + rd("主管津貼") + rd("專業証照津貼") + rd("職務津貼") + rd("補助津貼")) * 0.5

		//            ElseIf rd("端午獎金") = 0 And rd("中秋獎金") = 0 And rd("試用期滿") = True Then   '端午,中秋皆沒發
		//               rd("年終獎金") = rd("年度在職天數") / 365 * (rd("底薪") + rd("伙食津貼") + rd("主管津貼") + rd("專業証照津貼") + rd("職務津貼") + rd("補助津貼")) * rd("獎金比率") + _
		//                                rd("年度在職天數") / 365 * (rd("底薪") + rd("伙食津貼") + rd("主管津貼") + rd("專業証照津貼") + rd("職務津貼") + rd("補助津貼")) * 1

		//            ElseIf rd("端午獎金") = 0 And rd("中秋獎金") = 0 And rd("試用期滿") = False Then   '端午,中秋皆沒發
		//               rd("年終獎金") = rd("年度在職天數") / 365 * (rd("底薪") + rd("伙食津貼") + rd("主管津貼") + rd("專業証照津貼") + rd("職務津貼") + rd("補助津貼")) * rd("獎金比率")
		//            End If
		//         End If

		// '============================
		const end_of_year_bonus_id = bonus_type_list.find((bt) => bt.name === "年終獎金")?.id!;
		let end_of_year_bonus = 0;
		for (const bonus of bonus_list) {
			if (bonus.bonus_id === end_of_year_bonus_id) {
				end_of_year_bonus += bonus.amount ?? 0;
			}
		}
		return end_of_year_bonus;
	}

	//MARK: 營運績效獎金
	async getOperationalPerformanceBonus(
		pay_type: PayTypeEnumType,
		bonus_list: Bonus[],
		bonus_type_list: BonusType[],
	): Promise<number> {
		if (pay_type === PayTypeEnum.enum.foreign_15_bonus) {
			const operational_performance_bonus_id = bonus_type_list.find((bt) => bt.name === "營運績效獎金")?.id!;
			let operational_performance_bonus = 0;
			for (const bonus of bonus_list) {
				if (bonus.bonus_id === operational_performance_bonus_id) {
					operational_performance_bonus += bonus.amount ?? 0;
				}
			}
			return operational_performance_bonus;
		} else return 0;
	}

	// MARK: 職務績效獎金
	async getOccupationalPerformanceBonus(		
		// TODO
	): Promise<number> {
		// TODO
		return 0
	}

	//MARK: 薪資所得扣繳總額
	async getSalaryIncomeDeduction(
		discounted_employee_payment_dec: EmployeePaymentFEType,
		reissue_salary: number,
		full_attendance_bonus: number,
		exceed_overtime_pay: number,
		leave_deduction: number,
		operational_performance_bonus: number,
		other_addition_tax: number,
		special_personal_leave_deduct: number,
		other_deduction_tax: number,
		shift_allowance: number,
		professional_cert_allowance: number
	): Promise<number> {
		/* 
			rd("薪資所得扣繳總額") = 
				rd("底薪") + 
				rd("主管津貼") + 
				rd("專業証照津貼") + 
				rd("職務津貼") + 
				rd("營運積效獎金") + 
				rd("補發薪資") +
				rd("超時加班") +
				rd("其他加項稅") +		// ?
				rd("全勤獎金") +
				rd("輪班津貼") +
				rd("夜點費") -			// ?
				rd("請假扣款") -
				rd("特別事假扣款") -	// calc?
				rd("其他減項稅") 		// ?
		*/
		const salary_income_deduction =
			discounted_employee_payment_dec.base_salary +
			(discounted_employee_payment_dec.supervisor_allowance ?? 0) +
			professional_cert_allowance +
			(discounted_employee_payment_dec.occupational_allowance ?? 0) +
			operational_performance_bonus +
			(discounted_employee_payment_dec.long_service_allowance_type ==
				LongServiceEnum.enum.month_allowance
				? discounted_employee_payment_dec.long_service_allowance
				: 0) +
			reissue_salary +
			exceed_overtime_pay +
			other_addition_tax +
			full_attendance_bonus +
			(shift_allowance ?? 0) - //+
			// rd("夜點費") -
			leave_deduction -
			special_personal_leave_deduct -
			other_deduction_tax;

		return salary_income_deduction;
	}
	//MARK: 工資墊償
	async getSalaryAdvance(
		pay_type: PayTypeEnumType,
		payset: Payset | undefined,
		discounted_employee_payment_dec: EmployeePaymentFEType,
		insurance_rate_setting: InsuranceRateSettingDecType,
		employee_data: EmployeeDataDecType
	): Promise<number> {
		const l_i = discounted_employee_payment_dec.l_i;
		const wci_apf = insurance_rate_setting.l_i_wage_replacement_rate;
		const l_i_day = payset?.li_day ?? 30;
		const additional_l_i = 0;
		const work_type = employee_data.work_type;
		const work_status = employee_data.work_status;

		if (pay_type === PayTypeEnum.Enum.month_salary) {
			if (work_type === FOREIGN || work_status === FOREIGN) {
				return (
					Round((l_i * wci_apf * l_i_day) / 30, 1) +
					Round((l_i * wci_apf * additional_l_i) / 30, 1)
				); //'Jerry 20220823工資墊償基金分開計算
			} else if (employee_data.work_status === BOSS) {
				return (
					Round((l_i * wci_apf * l_i_day) / 30, 3) +
					Round((l_i * wci_apf * additional_l_i) / 30, 3)
				); //'Jerry 20220823工資墊償基金分開計算
			} else if (
				work_status === PARTTIME1 ||
				work_status === PARTTIME2 ||
				work_status === CONTRACT ||
				work_status === NEWBIE ||
				work_status === WILL_LEAVE
			) {
				return (
					Round((l_i * wci_apf * l_i_day) / 30, 1) +
					Round((l_i * wci_apf * additional_l_i) / 30, 1)
				); //'Jerry 20220823工資墊償基金分開計算
			} else {
				return (
					Round((l_i * wci_apf * l_i_day) / 30, 1) +
					Round((l_i * wci_apf * additional_l_i) / 30, 1)
				); //'Jerry 20220823工資墊償基金分開計算
			}
		}
		return -1;
	}
	//MARK: 薪資所得稅 (缺表)
	async getSalaryIncomeTax(
		employee_data: EmployeeDataDecType,
		issue_date: string,
		salary_income_tax_list: SalaryIncomeTaxDecType[],
		salary_income_deduction: number
	): Promise<number> {
		/*
					rd("薪資所得稅") = FindTex(
						rd("薪資所得扣繳總額"),
						rd("扶養人數"), 
						rd("工作類別"), 
						rd("工作形態"), 
						rd("入境日期"), 
						rd("工作天數")
					)
		*/
		const Tax = salary_income_deduction;
		const Num = employee_data.dependents;
		const kind1 = employee_data.work_type;
		const kind2 = employee_data.work_status;
		/*
		const Entity = rd("入境日期");
		const Day = rd("工作天數");			// no use in prev salary system code
		*/

		const START_WORK_DAY = new Date(employee_data.registration_date);
		const PAY_DATE = new Date(issue_date);

		const differenceInMilliseconds =
			START_WORK_DAY.getTime() - PAY_DATE.getTime();
		const differenceInDays = Math.floor(
			differenceInMilliseconds / (1000 * 60 * 60 * 24)
		);

		// Jerry 07/01/31 主要區別外籍勞工 同時也是當月離職人員的算法會與間接人員計計算邏輯衝突,因此以工作類別區分外籍勞工
		if (kind1 === FOREIGN || kind2 === FOREIGN) {
			// Jerry 07/09/21  15840 ==> 17280   09/4/28 17280 ==> 25920
			if (differenceInDays > 183) return Round(Tax * 0.06);
			else {
				if (Tax < 25920) return Round(Tax * 0.06);
				else return Round(Tax * 0.2);
			}
		}

		if (kind2 === LEAVE_MAN) return 0;

		if (Tax > 0) {
			const salary_income_tax = salary_income_tax_list.find((sit) => sit.salary_start <= Tax && sit.salary_end >= Tax && sit.dependent === (Num ?? 0));
			if (salary_income_tax != null) {
				if (kind2 === NEWBIE || kind2 === WILL_LEAVE)
					return Round(salary_income_tax.tax_amount);
				else return salary_income_tax.tax_amount;
			}
		}

		// return Round(Tax * 0.06);
		return 0;
	}
	//MARK: 獎金所得稅
	async getBonusTax(): Promise<number> {
		const bonus_tax = -1;
		return bonus_tax;
	}
	//MARK: 不休假代金
	async getNonLeaveCompensation(
		holiday_list: Holiday[],
		holidays_type: HolidaysType[],
		gross_salary: number,
		insurance_rate_setting: InsuranceRateSettingDecType,
		employee_data: EmployeeDataDecType
	): Promise<number> {
		const non_leave_comp_id = holidays_type.find(
			(h) => h.holidays_name === "不休假"
		)!.pay_id;
		// const multiplier = holidays_type.find(
		// 	(h) => h.holidays_name === "不休假"
		// )!.multiplier;
		let non_leave_compensation = 0;
		holiday_list.map((h) => {
			if (h.pay_order === non_leave_comp_id) {
				non_leave_compensation += h.total_hours ?? 0;
			}
		});
		if (employee_data.work_type === FOREIGN || employee_data.work_status === FOREIGN) {
			return (
				non_leave_compensation * Floor(insurance_rate_setting.min_wage / 240, 2)
			);
		} else {
			return (non_leave_compensation * gross_salary) / 240;
		}
	}
	//MARK: 課稅所得
	async getTaxableIncome(
		discounted_employee_payment_dec: EmployeePaymentFEType,
		exceed_overtime_pay: number,
		professional_cert_allowance: number
	): Promise<number> {
		// rd("課稅所得") = rd("底薪") + rd("主管津貼") + rd("專業証照津貼") + rd("職務津貼") + rd("超時加班")
		//     'Jerry 07/01/05 取消"超時加班"==> 改為"職務津貼"
		const taxable_income =
			discounted_employee_payment_dec.base_salary +
			(discounted_employee_payment_dec.supervisor_allowance ?? 0) +
			(professional_cert_allowance ?? 0) +
			(discounted_employee_payment_dec.occupational_allowance ?? 0) +
			exceed_overtime_pay;
		return taxable_income;
	}
	//MARK: 課稅小計
	async getTaxableSubtotal(
		pay_type: PayTypeEnumType,
		discounted_employee_payment_dec: EmployeePaymentFEType,
		operational_performance_bonus: number,
		reissue_salary: number,
		exceed_overtime_pay: number,
		other_addition_tax: number,
		full_attendance_bonus: number,
		end_of_year_bonus: number,
		professional_cert_allowance: number,
		shift_allowance: number
	): Promise<number> {
		// return -1;
		if (pay_type === PayTypeEnum.Enum.month_salary) {
			/*
					rd("課稅小計") = 
						rd("底薪") + 
						rd("主管津貼") + 
						rd("專業証照津貼") + 
						rd("職務津貼") + 
						rd("營運積效獎金") + 
						rd("補發薪資") + 
						rd("超時加班") + 
						rd("其他加項稅") + 
						rd("全勤獎金") + 
						rd("輪班津貼") + 
						rd("夜點費") + 
						rd("績效獎金") + 
						rd("專案獎金")
			*/
			// [底薪]+[主管津貼]+[職務津貼]+CheckNull(獎金!積效獎金,0)+CheckNull(獎金!年終獎金,0)+CheckNull(其他!補發薪資,0)+[超時加班]+CheckNull(其他!其他加項稅,0)+CheckNull(獎金!全勤獎金,0)+[輪班津貼]+CheckNull(定存款!夜點費,0) AS 課稅小計,
			return (
				discounted_employee_payment_dec.base_salary +
				(discounted_employee_payment_dec.supervisor_allowance ?? 0) +
				(professional_cert_allowance ?? 0) +
				(discounted_employee_payment_dec.occupational_allowance ?? 0) +
				(discounted_employee_payment_dec.long_service_allowance_type ==
					LongServiceEnum.Enum.month_allowance
					? discounted_employee_payment_dec.long_service_allowance
					: 0) +
				operational_performance_bonus + //在bonus裡 id=2
				reissue_salary +
				exceed_overtime_pay +
				other_addition_tax +
				full_attendance_bonus +
				(shift_allowance ?? 0) //+
				// rd("夜點費") +
				// rd("績效獎金") +
				// rd("專案獎金")
			);
		}
		if (pay_type === rd("加班費")) {
			// rd("課稅小計") = rd("超時加班") + rd("營運積效獎金") + rd("專案獎金") + rd("其他加項稅") 'hm 20201023
			return (
				exceed_overtime_pay +
				operational_performance_bonus +
				rd("專案獎金") +
				other_addition_tax
			);
		}

		if (pay_type === rd("不休假代金")) return 0;

		if (
			pay_type === rd("端午獎金") ||
			pay_type === rd("中秋獎金") ||
			pay_type === rd("年終獎金") ||
			pay_type === rd("營運考核獎金") ||
			pay_type === rd("專案考核獎金") ||
			pay_type === rd("董監事酬勞")
		)
			return (
				end_of_year_bonus +
				rd("績效獎金") +
				operational_performance_bonus +
				rd("專案獎金")
			); // '2014/7/24 增加營運積效獎金

		return 0;
	}
	//MARK: 其他減項?
	async getOtherDeduction(
		expense_list: Expense[],
		expense_class_list: ExpenseClass[]
	): Promise<number> {
		const expenseList = expense_list.filter((e) => e.kind === 2);
		let other_deduction_ids = expense_class_list
			.filter((ec) => ec.other_less === 1)
			.map((ec) => ec.id);
		let other_deduction = 0;
		for (const expense of expenseList) {
			if (other_deduction_ids.includes(expense.id)) {
				other_deduction += expense.amount ?? 0;
			}
		}
		return other_deduction;
	}
	async getOtherDeductionDetail(
		expense_with_type_list: ExpenseWithType[],
		expense_class_list: ExpenseClass[]
	): Promise<ExpenseWithType[] | null> {
		let other_deduction_ids = expense_class_list
			.filter((ec) => ec.other_less === 1)
			.map((ec) => ec.id);
		const other_deduction_list = expense_with_type_list.filter(
			(e) => other_deduction_ids.includes(e.id) && e.kind === 2
		);
		return other_deduction_list;
	}
	//MARK: 其他加項?
	async getOtherAddition(
		expense_list: Expense[],
		allowance_type_list: AllowanceType[]
	): Promise<number> {
		const expenseList = expense_list.filter((e) => e.kind === 1);
		let other_addition_ids = allowance_type_list
			.filter((at) => at.other_add === 1)
			.map((at) => at.id);
		let other_addition = 0;
		for (const expense of expenseList) {
			if (other_addition_ids.includes(expense.id)) {
				other_addition += expense.amount ?? 0;
			}
		}
		return other_addition;
	}
	async getOtherAdditionDetail(
		expense_with_type_list: ExpenseWithType[],
		allowance_type_list: AllowanceType[]
	): Promise<ExpenseWithType[] | null> {
		let other_addition_ids = allowance_type_list
			.filter((at) => at.other_add === 1)
			.map((at) => at.id);
		const other_addition_list = expense_with_type_list.filter(
			(a) => other_addition_ids.includes(a.id) && a.kind === 1
		);
		return other_addition_list;
	}
	//MARK: 其他加項稅 ?
	async getOtherAdditionTax(
		expense_list: Expense[],
		allowance_type_list: AllowanceType[]
	): Promise<number> {
		const expenseList = expense_list.filter((e) => e.kind === 1);
		let other_addition_tax_ids = allowance_type_list
			.filter((at) => at.other_tax === 1)
			.map((at) => at.id);
		let other_addition_tax = 0;
		for (const expense of expenseList) {
			if (other_addition_tax_ids.includes(expense.id)) {
				other_addition_tax += expense.amount ?? 0;
			}
		}
		return other_addition_tax;
	}
	async getOtherAdditionTaxDetail(
		expense_with_type_list: ExpenseWithType[],
		allowance_type_list: AllowanceType[]
	): Promise<ExpenseWithType[] | null> {
		let other_addition_tax_ids = allowance_type_list
			.filter((at) => at.other_tax === 1)
			.map((at) => at.id);
		const other_addition_tax_list = expense_with_type_list.filter(
			(a) => other_addition_tax_ids.includes(a.id) && a.kind === 1
		);
		return other_addition_tax_list;
	}
	//MARK: 其他減項稅 ?
	async getOtherDeductionTax(
		expense_list: Expense[],
		expense_class_list: ExpenseClass[]
	): Promise<number> {
		const expenseList = expense_list.filter((e) => e.kind === 2);
		let other_deduction_tax_ids = expense_class_list
			.filter((ec) => ec.other_tax === 1)
			.map((ec) => ec.id);
		let other_deduction_tax = 0;
		for (const expense of expenseList) {
			if (other_deduction_tax_ids.includes(expense.id)) {
				other_deduction_tax += expense.amount ?? 0;
			}
		}
		return other_deduction_tax;
	}
	async getOtherDeductionTaxDetail(
		expense_with_type_list: ExpenseWithType[],
		expense_class_list: ExpenseClass[]
	): Promise<ExpenseWithType[]> {
		let other_deduction_tax_ids = expense_class_list
			.filter((ec) => ec.other_tax === 1)
			.map((ec) => ec.id);
		const other_deduction_tax_list = expense_with_type_list.filter(
			(e) => other_deduction_tax_ids.includes(e.id) && e.kind === 2
		);
		return other_deduction_tax_list;
	}
	//MARK: 住宿代扣款（舊伙食扣款）
	async getMealDeduction(
		expense_list: Expense[],
		expense_class_list: ExpenseClass[]
	): Promise<number> {
		const expenseList = expense_list.filter((e) => e.kind === 2);
		const meal_deduction_id = expense_class_list.find((ec) => ec.name === "住宿代扣款")?.id;
		let meal_deduction = 0;
		for (const expense of expenseList) {
			if (expense.id === meal_deduction_id) {
				meal_deduction += expense.amount ?? 0;
			}
		}
		return meal_deduction;
	}
	//MARK: 非課稅小計
	async getNonTaxableSubtotal(
		discounted_employee_payment_dec: EmployeePaymentFEType,
		weekday_overtime_pay: number,
		rest_overtime_pay: number,
		non_leave_compensation: number,
		other_addition: number,
		retirement_income: number,
		expense_list: Expense[],
		expense_class_list: ExpenseClass[]
	): Promise<number> {
		// rd("非課稅小計") = rd("伙食津貼") + rd("平日加班費") + rd("假日加班費") + rd("補助津貼") + rd("其他加項") + rd("不休假代金") + rd("退職所得") + rd("勞保減免") + rd("健保補助") 'hm 111/0427const ehrService = container.resolve(EHRService);
		const l_i_subsidy_id = expense_class_list.find(
			(ec) => ec.name === "勞保殘障減免"
		)?.id!;
		const h_i_subsidy_id = expense_class_list.find(
			(ec) => ec.name === "健保補助"
		)?.id!;
		const expenseList = expense_list.filter((e) => e.kind === 1);
		let l_i_subsidy = 0;
		let h_i_subsidy = 0;
		for (const expense of expenseList) {
			if (expense.id === l_i_subsidy_id) {
				l_i_subsidy += expense.amount ?? 0;
			}
			if (expense.id === h_i_subsidy_id) {
				h_i_subsidy += expense.amount ?? 0;
			}
		}
		const non_taxable_subtotal =
			(discounted_employee_payment_dec.food_allowance ?? 0) +
			weekday_overtime_pay +
			rest_overtime_pay +
			(discounted_employee_payment_dec.subsidy_allowance ?? 0) +
			non_leave_compensation +
			other_addition +
			retirement_income +
			l_i_subsidy +
			h_i_subsidy;
		return non_taxable_subtotal;
	}
	//MARK: 減項小計(要補信託提存)
	async getDeductionSubtotal(
		pay_type: PayTypeEnumType,
		salary_income_tax: number,
		bonus_tax: number,
		welfare_contribution: number,
		l_i_deduction: number,
		h_i_deduction: number,
		group_insurance_deduction: number,
		group_insurance_deduction_promotion: number,
		leave_deduction: number,
		special_personal_leave_deduct: number,
		other_deduction: number,
		other_deduction_tax: number,
		income_tax_deduction: number,
		l_r_self: number,
		parking_fee: number,
		brokerage_fee: number,
		v_2_h_i: number,
		meal_deduction: number
	): Promise<number> {
		// If PayType = Moon_Pay Then
		// rd("減項小計") = rd("薪資所得稅") + rd("獎金所得稅") + rd("福利金提撥") + rd("勞保扣除額") + rd("健保扣除額") + rd("團保費代扣") + rd("團保費代扣_升等") + _
		//                      rd("請假扣款") + rd("特別事假扣款") + rd("伙食扣款") + rd("其他減項") + rd("其他減項稅") + rd("股票貸款") + rd("車輛貸款") + _
		//                      rd("所得稅代扣") + rd("勞退金自提") + rd("停車費") + rd("仲介費") + rd("二代健保")                                                             'Jerry 112/06/03 for 團保費代扣_升等 & 特別事假扣款
		// If rd("持股信託") = True Then
		// rd("減項小計") = rd("減項小計") + rd("員工提存金") + rd("特別獎勵金_員工")
		// ElseIf PayType = OverTime_Pay Then
		// rd("減項小計") = rd("薪資所得稅") + rd("二代健保") + rd("其他減項") + rd("其他減項稅") 'hm 20201023
		// ElseIf (PayType = Award_1_Pay Or PayType = Award_2_Pay Or PayType = YearEnd_Pay Or PayType = YearResult_Pay Or PayType = Project_Pay Or PayType = DS_Pay) Then
		// rd("減項小計") = rd("獎金所得稅") + rd("其他減項稅") + rd("二代健保")
		// rd("薪資所得扣繳總額") = rd("課稅小計")   'Jerry 07/04/25  for 扣繳憑單 and 財務部報稅用
		// ElseIf PayType = Non_Leaving_Pay Then  '2017/01/09 單獨發放不休假代金
		// rd("非課說小計") = rd("不休假代金")
		if (pay_type === PayTypeEnum.Enum.month_salary) {
			const deduction_subtotal =
				salary_income_tax +
				bonus_tax +
				welfare_contribution +
				l_i_deduction +
				h_i_deduction +
				group_insurance_deduction +
				group_insurance_deduction_promotion +
				leave_deduction +
				special_personal_leave_deduct +
				meal_deduction +
				other_deduction +
				other_deduction_tax +
				// rd("股票貸款") +
				// rd("車輛貸款") +
				income_tax_deduction +
				l_r_self +
				parking_fee +
				brokerage_fee +
				v_2_h_i;
			return deduction_subtotal;
		} else if (pay_type === PayTypeEnum.Enum.foreign_15_bonus) {
			//MARK: 不確定加班費等於15日？
			const deduction_subtotal =
				salary_income_tax +
				v_2_h_i +
				other_deduction +
				other_deduction_tax;
			return deduction_subtotal;
		}
		return -1;
	}
	//MARK: 勞保費
	async getLaborInsurancePay(
		discounted_employee_payment_dec: EmployeePaymentFEType,
		employee_data: EmployeeDataDecType,
		insurance_rate_setting: InsuranceRateSettingDecType,
		payset: Payset | undefined,
		received_elderly_benefits: boolean,
		pay_type: PayTypeEnumType
	): Promise<number> {
		// 有追加
		// 外勞
		//  x1 = Round(Round(rd("勞保") * wci_normal * 0.700001 * rd("勞保天數") / 30, 0) + Round(rd("職災") * wci_oi * rd("勞保天數") / 30, 0), 0) 'Jerry 20220823工資墊償基金分開計算
		//  x2 = Round(Round(rd("勞保") * wci_normal * 0.700001 * rd("勞保追加") / 30, 0) + Round(rd("職災") * wci_oi * rd("勞保追加") / 30, 0), 0) 'Jerry 20220823工資墊償基金分開計算
		// 總經理
		// x1 = Round(Round(rd("勞保") * wci_normal * 0.700001 * rd("勞保天數") / 30, 0) + Round(rd("職災") * wci_oi * rd("勞保天數") / 30, 0), 0) 'Jerry 20220823工資墊償基金分開計算
		// x2 = Round(Round(rd("勞保") * wci_normal * 0.700001 * rd("勞保追加") / 30, 0) + Round(rd("職災") * wci_oi * rd("勞保追加") / 30, 0), 0) 'Jerry 20220823工資墊償基金分開計算
		// ElseIf (rd("工作形態") = "工讀生" Or rd("工作形態") = "建教生" Or rd("工作形態") = "約聘人員" Or rd("工作形態") = "當月新進人員" Or rd("工作形態") = "當月離職人員_破月")
		// x1 = Round(Round(rd("勞保") * wci_normal * 0.700001 * rd("勞保天數") / 30, 0) + Round(rd("勞保") * wci_ji * 0.700001 * rd("勞保天數") / 30, 0) + Round(rd("職災") * wci_oi * rd("勞保天數") / 30, 0), 0) 'Jerry 20220823工資墊償基金分開計算
		//  x2 = Round(Round(rd("勞保") * wci_normal * 0.700001 * rd("勞保追加") / 30, 0) + Round(rd("勞保") * wci_ji * 0.700001 * rd("勞保追加") / 30, 0) + Round(rd("職災") * wci_oi * rd("勞保追加") / 30, 0), 0) 'Jerry 20220823工資墊償基金分開計算
		// else
		// x1 = Round(Round(rd("勞保") * wci_normal * 0.700001 * rd("勞保天數") / 30, 0) + Round(rd("勞保") * wci_ji * 0.700001 * rd("勞保天數") / 30, 0) + Round(rd("職災") * wci_oi * rd("勞保天數") / 30, 0), 0) 'Jerry 20220823工資墊償基金分開計算
		// x2 = Round(Round(rd("勞保") * wci_normal * 0.700001 * rd("勞保追加") / 30, 0) + Round(rd("勞保") * wci_ji * 0.700001 * rd("勞保追加") / 30, 0) + Round(rd("職災") * wci_oi * rd("勞保追加") / 30, 0), 0) 'Jerry 20220823工資墊償基金分開計算
		// If rd("已領老年給付") = True Then
		//        'x1 = Round(rd("勞保") * 0.0009 * rd("勞保天數") / 30, 0) 'Jerry 100426 已領老年給付者,公司付員工職災保險
		//        'x2 = Round(rd("勞保") * 0.0009 * rd("勞保追加") / 30, 0) 'Jerry 100426 已領老年給付者,公司付員工職災保險
		//        'x1 = Round(rd("勞保") * wci_oi * rd("勞保天數") / 30, 0) 'Jerry 100426 已領老年給付者,公司付員工職災保險
		//        'x2 = Round(rd("勞保") * wci_oi * rd("勞保追加") / 30, 0) 'Jerry 100426 已領老年給付者,公司付員工職災保險

		//        x1 = Round(rd("職災") * wci_oi * rd("勞保天數") / 30, 0) ''hm 20220526增加職災級距
		//        x2 = Round(rd("職災") * wci_oi * rd("勞保追加") / 30, 0) ''hm 20220526增加職災級距

		//        rd("勞保費") = x1 + x2
		//     End If
		const wci_normal = insurance_rate_setting.l_i_accident_rate; // 勞工保險普通事故險
		const wci_oi = insurance_rate_setting.l_i_occupational_injury_rate; // 勞工保險職災保險率
		const l_i_day = payset?.li_day ?? 30;
		const l_i = discounted_employee_payment_dec.l_i;
		const occupational_injury =
			discounted_employee_payment_dec.occupational_injury;
		const additional_l_i = 0;
		const work_type = employee_data.work_type; //工作類別
		const work_status = employee_data.work_status; //工作型態
		const wci_ji = insurance_rate_setting.l_i_employment_pay_rate; // 勞工保險就業保險率
		if (pay_type === PayTypeEnum.Enum.month_salary) {
			if (received_elderly_benefits) {
				const x1 = Round((occupational_injury * wci_oi * l_i_day) / 30);
				const x2 = Round(
					(occupational_injury * wci_oi * additional_l_i) / 30
				);
				return x1 + x2;
			}
			if (work_type === FOREIGN || work_status === FOREIGN) {
				const x1 = Round(
					Round((l_i * wci_normal * 0.700001 * l_i_day) / 30) +
					Round((occupational_injury * wci_oi * l_i_day) / 30)
				); //'Jerry 20220823工資墊償基金分開計算
				const x2 = Round(
					Round((l_i * wci_normal * 0.700001 * additional_l_i) / 30) +
					Round(
						(occupational_injury * wci_oi * additional_l_i) / 30
					)
				); //'Jerry 20220823工資墊償基金分開計算
				return x1 + x2;
			} else if (employee_data.work_status === BOSS) {
				const x1 = Round(
					Round((l_i * wci_normal * 0.700001 * l_i_day) / 30) +
					Round((occupational_injury * wci_oi * l_i_day) / 30)
				); //'Jerry 20220823工資墊償基金分開計算
				const x2 = Round(
					Round((l_i * wci_normal * 0.700001 * additional_l_i) / 30) +
					Round(
						(occupational_injury * wci_oi * additional_l_i) / 30
					)
				); //'Jerry 20220823工資墊償基金分開計算
				return x1 + x2;
			} else if (
				work_status === PARTTIME1 ||
				work_status === PARTTIME2 ||
				work_status === CONTRACT ||
				work_status === NEWBIE ||
				work_status === WILL_LEAVE
			) {
				const x1 = Round(
					Round((l_i * wci_normal * 0.700001 * l_i_day) / 30) +
					Round((l_i * 0.700001 * wci_ji * l_i_day) / 30) +
					Round((occupational_injury * wci_oi * l_i_day) / 30)
				); //'Jerry 20220823工資墊償基金分開計算
				const x2 = Round(
					Round((l_i * wci_normal * 0.700001 * additional_l_i) / 30) +
					Round((l_i * wci_ji * 0.700001 * additional_l_i) / 30) +
					Round(
						(occupational_injury * wci_oi * additional_l_i) / 30
					)
				); //'Jerry 20220823工資墊償基金分開計算
				return x1 + x2;
			} else {
				const x1 = Round(
					Round((l_i * wci_normal * 0.700001 * l_i_day) / 30) +
					Round((l_i * wci_ji * 0.700001 * l_i_day) / 30) +
					Round((occupational_injury * wci_oi * l_i_day) / 30)
				);
				const x2 = Round(
					Round((l_i * wci_normal * 0.700001 * additional_l_i) / 30) +
					Round((l_i * wci_ji * 0.700001 * additional_l_i) / 30) +
					Round(
						(occupational_injury * wci_oi * additional_l_i) / 30
					)
				); //'Jerry 20220823工資墊償基金分開計算
				return x1 + x2;
			}
		}
		return -1;
	}
	//MARK: 健保費
	async getHealthInsurancePay(
		discounted_employee_payment_dec: EmployeePaymentFEType,
		employee_data: EmployeeDataDecType,
		insurance_rate_setting: InsuranceRateSettingDecType
	): Promise<number> {
		// 		'公司付健保費(外籍勞工算法同本國籍)
		// Function ComHel(ByVal money As Long, ByVal kind As String, ByVal HelAdd_YN As String)
		//  If HelAdd_YN = True Then
		//     Select Case kind
		//         Case Leave_Man, BOSS, Professor, Will_Leave   'Jerry 06/07/28 改為PartTime(工讀生)要扣健保費,若不扣時,健保額度輸入0即可
		//             ComHel = 0
		//         Case Else
		//             ComHel = Round(money * nhi_rate * 0.6 * (1 + nhi_people), 0) * 2
		//     End Select
		//  End If

		//  If HelAdd_YN = False Then
		//     Select Case kind
		//         Case Leave_Man, BOSS, Professor, Will_Leave   'Jerry 06/07/28 改為PartTime(工讀生)要扣健保費,若不扣時,健保額度輸入0即可
		//             ComHel = 0
		//         Case Else
		//             ComHel = Round(money * nhi_rate * 0.6 * (1 + nhi_people), 0)
		//     End Select
		//  End If

		// End Function
		const money = discounted_employee_payment_dec.h_i;
		const kind = employee_data.work_status;
		const HelAdd_YN = false; // 建保追加 => 似乎bang不見了
		const nhi_rate = insurance_rate_setting.h_i_standard_rate; // 健保一般保費費率 : 應該是這個
		const nhi_people = insurance_rate_setting.h_i_avg_dependents_count;

		if (HelAdd_YN) {
			if (
				kind === LEAVE_MAN ||
				kind === BOSS ||
				kind === PROFESSOR ||
				kind === WILL_LEAVE
			) {
				return 0;
			} else {
				return Round(money * nhi_rate * 0.6 * (1 + nhi_people)) * 2;
			}
		} else {
			if (
				kind === LEAVE_MAN ||
				kind === BOSS ||
				kind === PROFESSOR ||
				kind === WILL_LEAVE
			) {
				return 0;
			} else {
				return Round(money * nhi_rate * 0.6 * (1 + nhi_people));
			}
		}
	}
	//MARK: 團保費
	async getGroupInsurancePay(employee_data: EmployeeDataDecType): Promise<number> {
		/*
			rd("團保費") = ComInsurance(
				CheckNull(rd("團保類別"), X),
				rd("工作類別"),
				rd("工作形態")
			)    'Jerry 07/01/04 計算公司付團保
		*/
		const level = employee_data.group_insurance_type;
		const kind1 = employee_data.work_type;
		const kind2 = employee_data.work_status;
		//更新過團保費數值
		if (kind1 === FOREIGN || kind2 === FOREIGN) {
			if (level === "F") return 47;
		} else {
			if (level === "A") return 441;
			if (level === "C+") return 868;
		}

		throw new Error("No Implement");
	}
	//MARK: 停車費
	async getParkingFee(
		expense_list: Expense[],
		expense_class_list: ExpenseClass[],
	): Promise<number> {
		const expenseList = expense_list.filter((e) => e.kind === 2);
		const parking_fee_id = expense_class_list.find(
			(ec) => ec.name === "停車費"
		)?.id!;
		let parking_fee = 0;
		for (const expense of expenseList) {
			if (expense.id === parking_fee_id) {
				parking_fee += expense.amount ?? 0;
			}
		}
		return parking_fee;
	}
	//MARK: 仲介費
	async getBrokerageFee(
		expense_list: Expense[],
		expense_class_list: ExpenseClass[],
	): Promise<number> {
		const expenseList = expense_list.filter((e) => e.kind === 2);
		const brokerage_fee_id = expense_class_list.find((ec) => ec.name === "仲介費")?.id!;
		let brokerage_fee = 0;
		for (const expense of expenseList) {
			if (expense.id === brokerage_fee_id) {
				brokerage_fee += expense.amount ?? 0;
			}
		}
		return brokerage_fee;
	}
	//MARK: 所得稅代扣 可能要查表
	async getIncomeTaxDeduction(
		expense_list: Expense[],
		expense_class_list: ExpenseClass[],
	): Promise<number> {
		const expenseList = expense_list.filter((e) => e.kind === 2);
		const income_tax_deduction_id = expense_class_list.find((ec) => ec.name === "所得稅代扣")?.id!;
		let income_tax_deduction = 0;
		for (const expense of expenseList) {
			if (expense.id === income_tax_deduction_id) {
				income_tax_deduction += expense.amount ?? 0;
			}
		}
		return income_tax_deduction;
	}
	//MARK: 勞退金自提
	// 勞退級距＊勞退自提%
	async getLRSelf(
		discounted_employee_payment_dec: EmployeePaymentFEType
	): Promise<number> {
		return (
			discounted_employee_payment_dec.l_r *
			discounted_employee_payment_dec.l_r_self_ratio * 0.01
		);
		// const ehrService = container.resolve(EHRService);
		// const l_r_self_id = (await ehrService.getExpenseClass()).find(
		// 	(ec) => ec.name === "勞退金自提"
		// )?.id!;
		// const expenseList = await ehrService.getExpenseByEmpNoList(period_id, [
		// 	emp_no,
		// ]);
		// let l_r_self = 0;
		// for (const expense of expenseList) {
		// 	if (expense.id === l_r_self_id) {
		// 		l_r_self += expense.amount ?? 0;
		// 	}
		// }
		// return l_r_self;
	}
	//MARK: 薪資區隔?
	async getSalaryRange(total_salary: number): Promise<number> {
		// 		Function Insurance_level(ByVal Insurance As Long)
		//     If Insurance <= 72800 Then
		//        Insurance_level = 72800                               'Jerry 2007/01/04 42000改為43900 '2016.6.23 改為45800
		//     ElseIf Insurance > 72800 And Insurance <= 100000 Then    'Jerry 2022/07/01 45800改為72800
		//        Insurance_level = 100000
		//     ElseIf Insurance > 100000 And Insurance <= 170000 Then
		//        Insurance_level = 170000
		//     ElseIf Insurance > 170000 And Insurance <= 250000 Then
		//        Insurance_level = 250000
		//     ElseIf Insurance > 250000 And Insurance <= 1000000 Then
		//        Insurance_level = 1000000
		//     ElseIf Insurance > 1000000 Then
		//        Insurance_level = 1000001
		//     End If
		// End Function
		if (total_salary <= 72800) {
			return 72800;
		} else if (total_salary > 72800 && total_salary <= 100000) {
			return 100000;
		} else if (total_salary > 100000 && total_salary <= 170000) {
			return 170000;
		} else if (total_salary > 170000 && total_salary <= 250000) {
			return 250000;
		} else if (total_salary > 250000 && total_salary <= 1000000) {
			return 1000000;
		} else if (total_salary > 1000000) {
			return 1000001;
		} else {
			throw new Error("No Implement in 'getSalaryRange'");
		}
	}
	//MARK: 薪資總額
	async getTotalSalary(
		discounted_employee_payment_dec: EmployeePaymentFEType,
		full_attendance_bonus: number,
		professional_cert_allowance: number,
		shift_allowance: number
	): Promise<number> {
		// rd("底薪") + rd("伙食津貼") + rd("主管津貼") + rd("專業証照津貼") + rd("職務津貼") + rd("補助津貼") + rd("全勤獎金") + rd("輪班津貼")'Jerry 06/06/07 職災保險匯出
		const total_salary =
			discounted_employee_payment_dec.base_salary +
			(discounted_employee_payment_dec.food_allowance ?? 0) +
			(discounted_employee_payment_dec.supervisor_allowance ?? 0) +
			(professional_cert_allowance ?? 0) +
			(discounted_employee_payment_dec.occupational_allowance ?? 0) +
			(discounted_employee_payment_dec.subsidy_allowance ?? 0) +
			(discounted_employee_payment_dec.long_service_allowance_type ==
				LongServiceEnum.enum.month_allowance
				? discounted_employee_payment_dec.long_service_allowance
				: 0) +
			full_attendance_bonus +
			(shift_allowance ?? 0);
		return total_salary;
	}
	//MARK: 勞退金提撥
	async getLaborRetirementContribution(
		employee_data: EmployeeDataDecType,
		discounted_employee_payment_dec: EmployeePaymentFEType
	): Promise<number> {
		/*
			rd("勞退金提撥") = ComRetire(
				rd("勞退"), 
				rd("工作類別"), 
				rd("工作形態"), 
				CheckNull(rd("工作天數"), 30), 
				CheckNull(rd("勞保天數"), 30)
			) 'Jerry 07/07/24 加勞保天數計算
		*/
		const money = discounted_employee_payment_dec.l_r; //rd("勞退");
		const kind1 = employee_data.work_type;
		const kind2 = employee_data.work_status;
		const Normalday = 30; //rd("工作天數");
		const PartTimeDay = 30; //rd("勞保天數");

		if (kind1 === FOREIGN) return 0;
		if (kind2 === BOSS) return 0;
		if (kind2 === LEAVE_MAN) return 0;
		if (kind2 === PROFESSOR) return 0;
		if (kind2 === FOREIGN) return 0;

		if (
			[
				NEWBIE,
				WILL_LEAVE,
				PARTTIME1,
				PARTTIME2,
				CONTRACT,
				DAY_PAY,
			].includes(kind2)
		) {
			return Round(Round(((money * PartTimeDay) / 30) * 0.06)); // Jerry 07/07/24 由工作天數改為加勞保天數計算
		}

		return Round(Round(money * 0.06));
	}
	//MARK: 勞退金提撥_舊制?
	async getOldLaborRetirementContribution(
		employee_data: EmployeeDataDecType,
		taxable_subtotal: number,
		non_taxable_subtotal: number,
		payset: Payset | undefined
	): Promise<number> {
		// 		'公司付勞退金提撥_舊制
		// Function ComRetire_old(ByVal On_Board As Date, ByVal money As Long, ByVal kind1 As String, ByVal kind2 As String, Normalday As Byte, PartTimeDay As Byte)  'Jerry 08/04/01
		//   Dim Check_Date
		// '  Check_Date = DateSerial(Year(2005), Month(7), Day(1))

		//      If kind1 = Foreign_Man Then
		//         'ComRetire_old = 0 '2014/1/15 外籍勞工從事一般員工, 也要提撥勞退(舊)
		//        Select Case kind2
		//            Case Normal_Man
		//                ComRetire_old = Round(Round(money * 0.02, 0), 0)
		//            Case Else
		//                ComRetire_old = 0
		//        End Select
		//      Else
		//        If On_Board < DateValue("2005 / 7 / 1") Then
		//             Select Case kind2
		//                 Case BOSS, Foreign, Professor, Leave_Man
		//                     ComRetire_old = 0
		//                 Case New_Man, Will_Leave, PartTime_1, PartTime_2, Contract
		//                     ComRetire_old = Round(Round(money * PartTimeDay / 30 * 0.02, 0), 0)
		//                 Case Else
		//                     ComRetire_old = Round(Round(money * 0.02, 0), 0)

		//             End Select
		//        End If
		//     End If
		// End Function
		const On_Board = employee_data.registration_date;
		const kind1 = employee_data.work_type;
		const kind2 = employee_data.work_status;
		const money = taxable_subtotal + non_taxable_subtotal;
		const l_i_day = payset?.li_day ?? 30;

		if (kind1 === FOREIGN)
			if (kind2 === NORMAL_MAN) {
				//         'ComRetire_old = 0 '2014/1/15 外籍勞工從事一般員工, 也要提撥勞退(舊)
				return Round(Round(money * 0.02, 0), 0);
			} else return 0;
		else if (On_Board < "2005-7-1") {
			if (
				kind2 === BOSS ||
				kind2 === FOREIGN ||
				kind2 === PROFESSOR ||
				kind2 === LEAVE_MAN
			) {
				return 0;
			} else if (
				kind2 === NEWBIE ||
				kind2 === WILL_LEAVE ||
				kind2 === PARTTIME1 ||
				kind2 === PARTTIME2 ||
				kind2 === CONTRACT
			)
				return Round(Round(((money * l_i_day) / 30) * 0.02, 0), 0);
			else return Round(Round(money * 0.02, 0), 0);
		}
		return 0;
	}
	//MARK: 二代健保
	async getSecondGenerationHealthInsurance(
		period_id: number,
		emp_no: string,
		pay_type: PayTypeEnumType,
		insurance_rate_setting: InsuranceRateSettingDecType,
		employee_payment: EmployeePaymentFEType
	): Promise<number> {
		const employee_bonus_service = container.resolve(EmployeeBonusService);
		const employee_bonus_list =
			await employee_bonus_service.getEmployeeBonusByEmpNo(
				period_id,
				emp_no
			);
		if (pay_type === PayTypeEnum.Enum.month_salary) {
			const new_bonus =
				employee_bonus_list.filter(
					(e) => e.bonus_type === bonusTypeEnum.Enum.project_bonus
				)[0]?.app_amount ?? 0;
			const other_bonus =
				employee_bonus_list.filter(
					(e) => e.bonus_type !== bonusTypeEnum.Enum.project_bonus
				)[0]?.app_amount ?? 0;
			const accumulated_bonus =
				other_bonus +
				(await employee_bonus_service.getAccumulatedBonus(
					period_id,
					emp_no
				)); //同一期別中會先發其他獎金才發專案獎金
			const v2_h_i_rate = insurance_rate_setting.v2_h_i_supp_pay_rate;
			const v2_h_i_multiplier = insurance_rate_setting.v2_h_i_multiplier;
			const h_i = employee_payment?.h_i ?? 0;

			if (new_bonus + accumulated_bonus > h_i * v2_h_i_multiplier) {
				const v2_h_i =
					Math.min(
						new_bonus,
						accumulated_bonus + new_bonus - h_i * v2_h_i_multiplier
					) * v2_h_i_rate;
				return v2_h_i;
			}
		} else {
			const new_bonus =
				employee_bonus_list.filter(
					(e) => e.bonus_type !== bonusTypeEnum.Enum.project_bonus
				)[0]?.app_amount ?? 0;
			const accumulated_bonus =
				await employee_bonus_service.getAccumulatedBonus(
					period_id,
					emp_no
				);
			const v2_h_i_rate = insurance_rate_setting.v2_h_i_supp_pay_rate;
			const v2_h_i_multiplier = insurance_rate_setting.v2_h_i_multiplier;
			const h_i = employee_payment?.h_i ?? 0;

			if (new_bonus + accumulated_bonus > h_i * v2_h_i_multiplier) {
				const v2_h_i =
					Math.min(
						new_bonus,
						accumulated_bonus + new_bonus - h_i * v2_h_i_multiplier
					) * v2_h_i_rate;
				return v2_h_i;
			}
		}
		return 0;
		/*
	rd("二代健保") = 0
	    
		If PayType = DS_Pay Then ' 董監事 2014/7/24
	    
			If rd("營運積效獎金") + rd("專案獎金") > nhi_2nd_per Then  'hm20160128
				rd("二代健保") = (rd("營運積效獎金") + rd("專案獎金")) * nhi_2nd_rate 'hm20160128
				rd.Update
				rd.edit
			End If
	    
		Else
	    
			 '計算二代健保補充保費 '2014/04/16
			If rd("年終獎金") > 0 Or rd("年終積效獎金") > 0 Or rd("營運積效獎金") > 0 Or rd("績效獎金") > 0 Or rd("專案獎金") > 0 Or rd("公司獎勵金") > 0 Or rd("特別獎勵金_公司") > 0 Then
				'本次獎金
				bonus = rd("年終獎金") + rd("年終積效獎金") + rd("營運積效獎金") + rd("績效獎金") + rd("專案獎金") + rd("公司獎勵金") + rd("特別獎勵金_公司")
				'MsgBox bonus
			    
				Set kkk = CurrentDb.OpenRecordset("select 發薪日期 from 系統預設值")
			    
				Do Until kkk.EOF
					current_year = Year(kkk("發薪日期"))
					kkk.MoveNext
				Loop
				    
    
				Set re2 = CurrentDb.OpenRecordset("select *  from 累計獎金金額 " & "where 員工編號 = '" & rd("員工編號") & "' and 年度 =" & current_year)
				total_bonus = 0
				Do Until re2.EOF
					total_bonus = re2("累計金額")
					re2.MoveNext
				Loop
    
				total_bonus = total_bonus + bonus
				over_amt = total_bonus - rd("健保") * nhi_2nd_mitiple 'hm20160128
    
				If over_amt > 0 Then
				'over_amt & bonus 二者取小的*2% =補充保除費
					If over_amt < bonus Then
						rd("二代健保") = over_amt * nhi_2nd_rate 'hm20160128
					Else
						rd("二代健保") = bonus * nhi_2nd_rate 'hm20160128
				   End If
				   'MsgBox rd("二代健保")
					rd.Update
					rd.edit
				End If
    
			End If
			'2014/04/16
		End If
	 */
		return -1;
	}

	//MARK: 團保費代扣＿升等;
	// 感覺在這裡: DoCmd.OpenQuery "其他更新", acNormal, acEdit    'Jerry 07/09/03  增加退職所得  23/6/3 增加團保費代扣_升等
	async getGroupInsuranceDeductionPromotion(
		expense_list: Expense[],
		expense_class_list: ExpenseClass[]
	): Promise<number> {
		const expenseList = expense_list.filter((e) => e.kind === 2);
		const g_i_deduction_promotion_id = expense_class_list.find((ec) => ec.name === "團保代扣-升等")?.id!;
		let group_insurance_deduction_promotion = 0;
		for (const expense of expenseList) {
			if (expense.id === g_i_deduction_promotion_id) {
				group_insurance_deduction_promotion += expense.amount ?? 0;
			}
		}
		return group_insurance_deduction_promotion;
	}
	//MARK: 退職所得
	async getRetirementIncome(
		expense_list: Expense[],
		expense_class_list: ExpenseClass[],
	): Promise<number> {
		const expenseList = expense_list.filter((e) => e.kind === 2);
		const retirement_income_id = expense_class_list.find((ec) => ec.name === "退職所得")?.id!;
		let retirement_income = 0;
		for (const expense of expenseList) {
			if (expense.id === retirement_income_id) {
				retirement_income += expense.amount ?? 0;
			}
		}
		return retirement_income;
	}
	//MARK: 端午獎金
	async getDragonBoatFestivalBonus(): Promise<number> {
		return -1;
	}
	//MARK: 中秋獎金
	async getMidAutumnFestivalBonus(): Promise<number> {
		return -1;
	}
	//MARK: 考核獎金
	async getAssessmentBonus(): Promise<number> {
		return -1;
	}
	//MARK: 特別事假扣款
	async getSpecialPersonalLeaveDeduction(
		employee_data: EmployeeDataDecType,
		holidays_type: HolidaysType[],
		holiday_list: Holiday[],
		gross_salary: number,
		insurance_rate_setting: InsuranceRateSettingDecType,
		professional_cert_allowance: number
	): Promise<number> {
		// 		'特別事假扣款:
		// Function GetLeave2Money(kind1 As String, kind2 As String, money As Long, bouns As Long, t1 As Single)
		//     If kind1 = Foreign_Man Then
		//        GetLeave2Money = Round(SALARY_RATE * t1, 0)
		//     Else
		//     Select Case kind2
		//         Case Leave_Man
		//             GetLeave2Money = 0
		//         Case Foreign
		//             GetLeave2Money = Round(SALARY_RATE * t1, 0)
		//         Case Else
		//             GetLeave2Money = Round((money + bouns) / 240 * t1, 0)
		//     End Select
		//     End If
		// End Function
		// 薪資查詢.特別事假扣款 = GetLeave2Money(薪資查詢!工作類別,薪資查詢!工作形態,薪資查詢!原應發底薪,薪資查詢!補助津貼+薪資查詢!專業証照津貼,薪資查詢!特別事假時數);
		const kind1 = employee_data.work_type;
		const kind2 = employee_data.work_status;
		const special_personal_leave_id = holidays_type.find(
			(ht) => ht.holidays_name === "特別事假"
		)?.pay_id;
		let t1 = 0;
		const hourly_fee =
			(gross_salary + (professional_cert_allowance ?? 0)) / 240;
		for (const h of holiday_list) {
			if (h.pay_order === special_personal_leave_id) {
				t1 += h.total_hours ?? 0;
			}
		}
		if (kind1 === FOREIGN) {
			return Round(insurance_rate_setting.l_i_wage_replacement_rate * t1);
		} else {
			if (kind2 === LEAVE_MAN) {
				return 0;
			} else if (kind2 === FOREIGN) {
				return Round(
					insurance_rate_setting.l_i_wage_replacement_rate * t1
				);
			} else {
				return Round(hourly_fee * t1);
			}
		}
	}

	//MARK: 實發金額
	async getNetSalary(
		pay_type: PayTypeEnumType,
		taxable_subtotal: number,
		non_taxable_subtotal: number,
		deduction_subtotal: number
	): Promise<number> {
		// If (PayType = Moon_Pay Or PayType = OverTime_Pay) Then    'Jerry 10/011/10 只有15日另發加班,才需要計算                                                       'Jerry 06/05/19
		// rd("實發金額") = rd("課稅小計") + rd("非課說小計") - rd("減項小計")                 'Jerry 06/05/19
		// ElseIf (PayType = Award_1_Pay Or PayType = Award_2_Pay Or PayType = YearEnd_Pay Or PayType = YearResult_Pay Or PayType = Project_Pay Or PayType = DS_Pay) Then 'Jerry 06/05/19 , 06/06/08 ,07/08/26增加 Project_Pay, 10/02/03增加 YearResult_Pay,2014/7/24 增加DS_PAY
		//    rd("實發金額") = rd("課稅小計") - rd("減項小計")                                    'Jerry 06/05/19
		// End
		if (pay_type === PayTypeEnum.Enum.month_salary) {
			const net_salary =
				taxable_subtotal + non_taxable_subtotal - deduction_subtotal;
			return net_salary;
		}
		return -1;
	}
	//MARK: 特別事假
	async getSpecialPersonalLeave(
		holiday_list: Holiday[],
		holidays_type: HolidaysType[]
	): Promise<number> {
		const special_personal_leave_id = holidays_type.find(
			(ht) => ht.holidays_name === "特別事假"
		)?.pay_id;
		let special_personal_leave = 0;
		holiday_list.map((h) => {
			if (h.pay_order === special_personal_leave_id) {
				special_personal_leave += h.total_hours ?? 0;
			}
		});
		return special_personal_leave;
	}
	//MARK: 有全勤事假
	async getFullAtendancePersonalLeave(
		holiday_list: Holiday[],
		holidays_type: HolidaysType[]
	): Promise<number> {
		const full_attendance_personal_leave_id = holidays_type.find(
			(ht) => ht.holidays_name === "有全勤事假"
		)?.pay_id;
		let full_attendance_personal_leave = 0;
		holiday_list.map((h) => {
			if (h.pay_order === full_attendance_personal_leave_id) {
				full_attendance_personal_leave += h.total_hours ?? 0;
			}
		});
		return full_attendance_personal_leave;
	}
	//MARK: 有全勤病假
	async getFullAtendanceSickLeave(
		holiday_list: Holiday[],
		holidays_type: HolidaysType[]
	): Promise<number> {
		const full_attendance_sick_leave_id = holidays_type.find(
			(ht) => ht.holidays_name === "有全勤病假"
		)?.pay_id;
		let full_attendance_sick_leave = 0;
		holiday_list.map((h) => {
			if (h.pay_order === full_attendance_sick_leave_id) {
				full_attendance_sick_leave += h.total_hours ?? 0;
			}
		});
		return full_attendance_sick_leave;
	}
	async discountedPayment(
		employee_payment_dec: EmployeePaymentFEType,
		payset: Payset | undefined
	) {
		employee_payment_dec.base_salary =
			(employee_payment_dec.base_salary *
				(payset ? payset.work_day! : 30)) /
			30;
		employee_payment_dec.food_allowance =
			(employee_payment_dec.food_allowance *
				(payset ? payset.work_day! : 30)) /
			30;
		employee_payment_dec.occupational_allowance =
			(employee_payment_dec.occupational_allowance *
				(payset ? payset.work_day! : 30)) /
			30;
		employee_payment_dec.subsidy_allowance =
			(employee_payment_dec.subsidy_allowance *
				(payset ? payset.work_day! : 30)) /
			30;
		employee_payment_dec.supervisor_allowance =
			(employee_payment_dec.supervisor_allowance *
				(payset ? payset.work_day! : 30)) /
			30;
		employee_payment_dec.long_service_allowance =
			((employee_payment_dec.long_service_allowance_type ==
				LongServiceEnum.Enum.month_allowance
				? employee_payment_dec.long_service_allowance
				: 0) *
				(payset ? payset.work_day! : 30)) /
			30;
		return employee_payment_dec;
	}
	/*
if (!工作天數)
	工作天數 = 30
if (!勞保天數)
	勞保天數 = 30
if (!勞保追加)
	勞保追加 = 0
if (!健保追加)
	建保追加 = False
*/
}
