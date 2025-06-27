import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	type Sequelize,
} from "sequelize";
import { type CostCategoryEnumType } from "~/server/api/types/cost_category_type";
import { type WorkStatusEnumType } from "~/server/api/types/work_status_enum";
import { type WorkTypeEnumType } from "~/server/api/types/work_type_enum";

export class Transaction extends Model<
	InferAttributes<Transaction>,
	InferCreationAttributes<Transaction>
> {
	// id can be undefined during creation when using `autoIncrement`
	/** 識別碼 */
	declare id: CreationOptional<number>;
	/** 薪資期間 ID */
	declare period_id: number;
	/** 發薪日期 */
	declare issue_date: string;
	/** 發薪別 */
	declare pay_type: string;
  
	// 勞工相關信息
	/** 部門 */
	declare department: string;
	/** 員工編號 */
	declare emp_no: string;
	/** 員工姓名 */
	declare emp_name: string;
	/** 成本分類 */
	declare cost_category: CostCategoryEnumType;
	/** 工作類別 */
	declare work_type: WorkTypeEnumType;
	/** 工作形態 */
	declare work_status: WorkStatusEnumType;
	/** 職等 */
	declare position: number;
	/** 職級 */
	declare position_type: string;
	/** 團保類別 */
	declare group_insurance_type: string;
	/** 殘障等級 */
	declare disabilty_level: string;
	/** 性別 */
	declare sex_type: string;
	/** 身份(居留)證字號 */
	declare license_id: string;
	/** 扶養人數 */
	declare dependents: number;
	/** 健保眷口數 */
	declare healthcare_dependents: number;
	/** 居留證開始日期 */
	declare residence_permit_start_date: string | null;
	/** 居留證截止日期 */
	declare residence_permit_end_date: string | null;
	/** 到職日期 */
	declare registration_date: string;
	/** 離職日期 */
	declare quit_date: string | null;
	/** 台幣帳號 */
	declare bank_account_taiwan: string;
	/** 外幣帳號 */
	declare bank_account_foreign: string | null;
	/** 已領老年給付 */
	declare received_elderly_benefits: boolean;
	/** 年資 */
	declare seniority: number;
	/** 年度在職天數 */
	declare annual_days_in_service: number;
	/** 試用期滿 */
	declare probation_period_over: boolean;
	/** 勞保 */
	declare l_i: number;
	/** 健保 */
	declare h_i: number;
	/** 勞退 */
	declare l_r: number;
	/** 職災 */
	declare occupational_injury: number;
  
	// 加項
	/** 底薪 */
	declare base_salary: number;
	/** 主管津貼 */
	declare supervisor_allowance: number;
	/** 職務津貼 */
	declare occupational_allowance: number;
	/** 久任津貼 */
	declare long_service_allowance: number;
	/** 補助津貼 */
	declare subsidy_allowance: number;
	/** 伙食津貼 */
	declare food_allowance: number;
	/** 應發底薪 */
	declare gross_salary: number;
	/** 輪班津貼 */
	declare shift_allowance: number;
	/** 專業証照津貼 */
	declare professional_cert_allowance: number;
	/** 薪資總計 */
	declare salary_total: number;
	/** 全勤獎金 */
	declare full_attendance_bonus: number;
	/** 營運績效獎金 */
	declare operational_performance_bonus: number;
	/** 職務績效獎金 */
	declare occupational_performance_bonus: number;
	/** 補發薪資 */
	declare reissue_salary: number;
	/** 不休假代金 */
	declare non_leave_compensation: number;
	/** 退職所得 */
	declare retirement_income: number;
	/** 專案獎金 */
	declare project_bonus: number;
	/** 季績效獎金 */
	declare quarterly_performance_bonus: number;
	/** 平日134加班時數 */
	declare weekday_134_overtime_hours: number;
	/** 平日167加班時數 */
	declare weekday_167_overtime_hours: number;
	/** 休息日134加班時數 */
	declare rest_134_overtime_hours: number;
	/** 休息日167加班時數 */
	declare rest_167_overtime_hours: number;
	/** 休息日267加班時數 */
	declare rest_267_overtime_hours: number;
	/** 平日134加班時數(稅) */
	declare weekday_134_tax_overtime_hours: number;
	/** 平日167加班時數(稅) */
	declare weekday_167_tax_overtime_hours: number;
	/** 休息日134加班時數(稅) */
	declare rest_134_tax_overtime_hours: number;
	/** 休息日167加班時數(稅) */
	declare rest_167_tax_overtime_hours: number;
	/** 休息日267加班時數(稅) */
	declare rest_267_tax_overtime_hours: number;
	/** 平日加班費 */
	declare weekday_overtime_pay: number;
	/** 休息日加班費 */
	declare rest_overtime_pay: number;
	/** 超時加班費 */
	declare exceed_overtime_pay: number;
	/** 勞保加項 */
	declare l_i_addition_previous: number;
	/** 健保加項 */
	declare h_i_addition_previous: number;
	/** 其他加項 */
	declare other_addition: number;
	/** 其他加項稅 */
	declare other_addition_tax: number;
	/** 加項小計 */
	declare addition_subtotal: number;
  
	// 減項
	/** 車輛貸款 */
	declare vehicle_loan: number;
	/** 特別事假扣款 */
	declare special_personal_leave_deduct: number;
	/** 請假扣款 */
	declare leave_deduction: number;
	/** 員工信託提存金 */
	declare emp_trust_reserve: number;
	/** 特別信託獎勵金_員工 */
	declare emp_special_trust_incent: number;
	/** 勞保扣除額 */
	declare l_i_deduction: number;
	/** 健保扣除額 */
	declare h_i_deduction: number;
	/** 福利金提撥 */
	declare welfare_contribution: number;
	/** 團保費代扣 */
	declare group_insurance_deduction: number;
	/** 團保費代扣_升等 */
	declare g_i_deduction_promotion: number;
	/** 住宿代扣款 */
	declare dorm_deduction: number;
	/** 薪資所得稅 */
	declare income_tax: number;
	/** 獎金所得稅 */
	declare bonus_tax: number;
	/** 定存扣款 */
	declare fixed_deposit_deduction: number;
	/** 法院薪資扣押款 */
	declare court_salary_garnishment: number;
	/** 所得稅代扣 */
	declare income_tax_deduction: number;
	/** 勞退金自提 */
	declare l_r_self: number;
	/** 停車費 */
	declare parking_fee: number;
	/** 仲介費 */
	declare brokerage_fee: number;
	/** 二代健保 */
	declare v_2_h_i: number;
	/** 勞保減項 */
	declare l_i_deduction_previous: number;
	/** 健保減項 */
	declare h_i_deduction_previous: number;
	/** 其他減項 */
	declare other_deduction: number;
	/** 其他減項稅 */
	declare other_deduction_tax: number;
	/** 減項小計 */
	declare deduction_subtotal: number;
  
	/** 課稅所得 */
	declare taxable_income: number;
	/** 薪資所得扣繳總額 */
	declare salary_income_deduction: number;
	/** 課稅小計 */
	declare taxable_subtotal: number;
	/** 非課說小計 */
	declare non_taxable_subtotal: number;
	/** 工資墊償 */
	declare salary_advance: number;
	/** 公司勞保負擔(60%) */
	declare l_i_pay: number;
	/** 公司健保負擔(60%) */
	declare h_i_pay: number;
	/** 公司團保負擔 */
	declare group_insurance_pay: number;
	/** 勞退金提撥 */
	declare l_r_contribution: number;
	/** 勞退金提撥_舊制 */
	declare old_l_r_contribution: number;
	/** 公司獎勵金 */
	declare org_trust_reserve: number;
	/** 特別信託獎勵金_公司 */
	declare org_special_trust_incent: number;
	/** 薪資區隔 */
	declare salary_range: number;
	/** 薪資總額 */
	declare total_salary: number;
	/** 實發金額 */
	declare net_salary: number;
	/** 工作天數 */
	declare work_day: number;
	/** 勞保天數 */
	declare l_i_day: number;
	/** 健保天數 */
	declare h_i_day: number;
	/** 備註 */
	declare note: string;
  
	/** 外幣幣別 */
	declare currency_foreign: string | null;
	/** 匯率 */
	declare exchange_rate: number;
	/** 外幣金額 */
	declare currency_amount_foreign: number;
	/** 台幣金額 */
	declare currency_amount_taiwan: number;
	/** 持股信託_YN */
	declare has_trust: boolean;
	/** 是否禁用 */
	declare disabled: boolean;
  
	/** 建立日期 */
	declare create_date: CreationOptional<Date>;
	/** 建立者 */
	declare create_by: string;
	/** 更新日期 */
	declare update_date: CreationOptional<Date>;
	/** 更新者 */
	declare update_by: string;
}

/**
 * Initialize the Transaction model.
 * @param {Sequelize} sequelize - Sequelize instance.
 */
export function initTransaction(sequelize: Sequelize) {
	Transaction.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			period_id: {
				type: DataTypes.STRING(128),
				comment: "期間",
			},
			issue_date: {
				type: DataTypes.STRING(128),
				comment: "發薪日期",
			},
			pay_type: {
				type: DataTypes.STRING(128),
				comment: "發薪別",
			},
			department: {
				type: DataTypes.STRING(128),
				comment: "部門",
			},
			emp_no: {
				type: DataTypes.STRING(128),
				comment: "員工編號",
			},
			emp_name: {
				type: DataTypes.STRING(128),
				comment: "員工姓名",
			},
			cost_category: {
				type: DataTypes.STRING(128),
				comment: "成本分類",
			},
			work_type: {
				type: DataTypes.STRING(128),
				comment: "工作類別",
			},
			work_status: {
				type: DataTypes.STRING(128),
				comment: "工作形態",
			},
			position: {
				type: DataTypes.INTEGER,
				comment: "職等",
			},
			position_type: {
				type: DataTypes.STRING(128),
				comment: "職級",
			},
			group_insurance_type: {
				type: DataTypes.STRING(128),
				comment: "團保類別",
			},
			disabilty_level: {
				type: DataTypes.STRING(128),
				comment: "殘障等級",
			},
			sex_type: {
				type: DataTypes.STRING(128),
				comment: "性別",
			},
			license_id: {
				type: DataTypes.STRING(128),
				comment: "身份(居留)證字號",
			},
			dependents: {
				type: DataTypes.INTEGER,
				comment: "扶養人數",
			},
			healthcare_dependents: {
				type: DataTypes.INTEGER,
				comment: "健保眷口數",
			},
			residence_permit_start_date: {
				type: DataTypes.STRING(128),
				allowNull: true,
				comment: "居留證開始日期",
			},
			residence_permit_end_date: {
				type: DataTypes.STRING(128),
				allowNull: true,
				comment: "居留證截止日期",
			},
			registration_date: {
				type: DataTypes.STRING(128),
				comment: "到職日期",
			},
			quit_date: {
				type: DataTypes.STRING(128),
				allowNull: true,
				comment: "離職日期",
			},
			bank_account_taiwan: {
				type: DataTypes.STRING(128),
				comment: "台幣帳號",
			},
			bank_account_foreign: {
				type: DataTypes.STRING(128),
				allowNull: true,
				comment: "外幣帳號",
			},
			received_elderly_benefits: {
				type: DataTypes.BOOLEAN,
				comment: "已領老年給付",
			},
			seniority: {
				type: DataTypes.FLOAT,
				comment: "年資",
			},
			annual_days_in_service: {
				type: DataTypes.INTEGER,
				comment: "年度在職天數",
			},
			probation_period_over: {
				type: DataTypes.BOOLEAN,
				comment: "試用期滿",
			},
			l_i: {
				type: DataTypes.INTEGER,
				comment: "勞保",
			},
			h_i: {
				type: DataTypes.INTEGER,
				comment: "健保",
			},
			l_r: {
				type: DataTypes.INTEGER,
				comment: "勞退",
			},
			occupational_injury: {
				type: DataTypes.INTEGER,
				comment: "職災",
			},
			base_salary: {
				type: DataTypes.INTEGER,
				comment: "底薪",
			},
			supervisor_allowance: {
				type: DataTypes.INTEGER,
				comment: "主管津貼",
			},
			occupational_allowance: {
				type: DataTypes.INTEGER,
				comment: "職務津貼",
			},
			long_service_allowance: {
				type: DataTypes.INTEGER,
				comment: "久任津貼",
			},
			subsidy_allowance: {
				type: DataTypes.INTEGER,
				comment: "補助津貼",
			},
			food_allowance: {
				type: DataTypes.INTEGER,
				comment: "伙食津貼",
			},
			gross_salary: {
				type: DataTypes.INTEGER,
				comment: "應發底薪",
			},
			shift_allowance: {
				type: DataTypes.INTEGER,
				comment: "輪班津貼",
			},
			professional_cert_allowance: {
				type: DataTypes.INTEGER,
				comment: "專業証照津貼",
			},
			salary_total: {
				type: DataTypes.INTEGER,
				comment: "薪資總計",
			},
			full_attendance_bonus: {
				type: DataTypes.INTEGER,
				comment: "全勤獎金",
			},
			operational_performance_bonus: {
				type: DataTypes.INTEGER,
				comment: "營運績效獎金",
			},
			occupational_performance_bonus: {
				type: DataTypes.INTEGER,
				comment: "職務績效獎金",
			},
			reissue_salary: {
				type: DataTypes.INTEGER,
				comment: "補發薪資",
			},
			non_leave_compensation: {
				type: DataTypes.INTEGER,
				comment: "不休假代金",
			},
			retirement_income: {
				type: DataTypes.INTEGER,
				comment: "退職所得",
			},
			project_bonus: {
				type: DataTypes.INTEGER,
				comment: "專案獎金",
			},
			quarterly_performance_bonus: {
				type: DataTypes.INTEGER,
				comment: "季績效獎金",
			},
			weekday_134_overtime_hours: {
				type: DataTypes.FLOAT,
				comment: "平日134加班時數",
			},
			weekday_167_overtime_hours: {
				type: DataTypes.FLOAT,
				comment: "平日167加班時數",
			},
			rest_134_overtime_hours: {
				type: DataTypes.FLOAT,
				comment: "休息日134加班時數",
			},
			rest_167_overtime_hours: {
				type: DataTypes.FLOAT,
				comment: "休息日167加班時數",
			},
			rest_267_overtime_hours: {
				type: DataTypes.FLOAT,
				comment: "休息日267加班時數",
			},
			weekday_134_tax_overtime_hours: {
				type: DataTypes.FLOAT,
				comment: "平日134加班時數(稅)",
			},
			weekday_167_tax_overtime_hours: {
				type: DataTypes.FLOAT,
				comment: "平日167加班時數(稅)",
			},
			rest_134_tax_overtime_hours: {
				type: DataTypes.FLOAT,
				comment: "休息日134加班時數(稅)",
			},
			rest_167_tax_overtime_hours: {
				type: DataTypes.FLOAT,
				comment: "休息日167加班時數(稅)",
			},
			rest_267_tax_overtime_hours: {
				type: DataTypes.FLOAT,
				comment: "休息日267加班時數(稅)",
			},
			weekday_overtime_pay: {
				type: DataTypes.INTEGER,
				comment: "平日加班費",
			},
			rest_overtime_pay: {
				type: DataTypes.INTEGER,
				comment: "休息日加班費",
			},
			exceed_overtime_pay: {
				type: DataTypes.INTEGER,
				comment: "超時加班費",
			},
			l_i_addition_previous: {
				type: DataTypes.INTEGER,
				comment: "勞保加項",
			},
			h_i_addition_previous: {
				type: DataTypes.INTEGER,
				comment: "健保加項",
			},
			other_addition: {
				type: DataTypes.INTEGER,
				comment: "其他加項",
			},
			other_addition_tax: {
				type: DataTypes.INTEGER,
				comment: "其他加項稅",
			},
			addition_subtotal: {
				type: DataTypes.INTEGER,
				comment: "加項小計",
			},
			vehicle_loan: {
				type: DataTypes.INTEGER,
				comment: "車輛貸款",
			},
			special_personal_leave_deduct: {
				type: DataTypes.INTEGER,
				comment: "特別事假扣款",
			},
			leave_deduction: {
				type: DataTypes.INTEGER,
				comment: "請假扣款",
			},
			emp_trust_reserve: {
				type: DataTypes.INTEGER,
				comment: "員工信託提存金",
			},
			emp_special_trust_incent: {
				type: DataTypes.INTEGER,
				comment: "特別信託獎勵金_員工",
			},
			l_i_deduction: {
				type: DataTypes.INTEGER,
				comment: "勞保扣除額",
			},
			h_i_deduction: {
				type: DataTypes.INTEGER,
				comment: "健保扣除額",
			},
			welfare_contribution: {
				type: DataTypes.INTEGER,
				comment: "福利金提撥",
			},
			group_insurance_deduction: {
				type: DataTypes.INTEGER,
				comment: "團保費代扣",
			},
			g_i_deduction_promotion: {
				type: DataTypes.INTEGER,
				comment: "團保費代扣_升等",
			},
			dorm_deduction: {
				type: DataTypes.INTEGER,
				comment: "住宿代扣款",
			},
			income_tax: {
				type: DataTypes.INTEGER,
				comment: "薪資所得稅",
			},
			bonus_tax: {
				type: DataTypes.INTEGER,
				comment: "獎金所得稅",
			},
			fixed_deposit_deduction: {
				type: DataTypes.INTEGER,
				comment: "定存扣款",
			},
			court_salary_garnishment: {
				type: DataTypes.INTEGER,
				comment: "法院薪資扣押款",
			},
			income_tax_deduction: {
				type: DataTypes.INTEGER,
				comment: "所得稅代扣",
			},
			l_r_self: {
				type: DataTypes.INTEGER,
				comment: "勞退金自提",
			},
			parking_fee: {
				type: DataTypes.INTEGER,
				comment: "停車費",
			},
			brokerage_fee: {
				type: DataTypes.INTEGER,
				comment: "仲介費",
			},
			v_2_h_i: {
				type: DataTypes.INTEGER,
				comment: "二代健保",
			},
			l_i_deduction_previous: {
				type: DataTypes.INTEGER,
				comment: "勞保減項",
			},
			h_i_deduction_previous: {
				type: DataTypes.INTEGER,
				comment: "健保減項",
			},
			other_deduction: {
				type: DataTypes.INTEGER,
				comment: "其他減項",
			},
			other_deduction_tax: {
				type: DataTypes.INTEGER,
				comment: "其他減項稅",
			},
			deduction_subtotal: {
				type: DataTypes.INTEGER,
				comment: "減項小計",
			},
			taxable_income: {
				type: DataTypes.INTEGER,
				comment: "課稅所得",
			},
			salary_income_deduction: {
				type: DataTypes.INTEGER,
				comment: "薪資所得扣繳總額",
			},
			taxable_subtotal: {
				type: DataTypes.INTEGER,
				comment: "課稅小計",
			},
			non_taxable_subtotal: {
				type: DataTypes.INTEGER,
				comment: "非課說小計",
			},
			salary_advance: {
				type: DataTypes.FLOAT,
				comment: "工資墊償",
			},
			l_i_pay: {
				type: DataTypes.INTEGER,
				comment: "公司勞保負擔(60%)",
			},
			h_i_pay: {
				type: DataTypes.INTEGER,
				comment: "公司健保負擔(60%)",
			},
			group_insurance_pay: {
				type: DataTypes.INTEGER,
				comment: "公司團保負擔",
			},
			l_r_contribution: {
				type: DataTypes.INTEGER,
				comment: "勞退金提撥",
			},
			old_l_r_contribution: {
				type: DataTypes.INTEGER,
				comment: "勞退金提撥_舊制",
			},
			org_trust_reserve: {
				type: DataTypes.INTEGER,
				comment: "公司獎勵金",
			},
			org_special_trust_incent: {
				type: DataTypes.INTEGER,
				comment: "特別信託獎勵金_公司",
			},
			salary_range: {
				type: DataTypes.INTEGER,
				comment: "薪資區隔",
			},
			total_salary: {
				type: DataTypes.INTEGER,
				comment: "薪資總額",
			},
			net_salary: {
				type: DataTypes.INTEGER,
				comment: "實發金額",
			},
			work_day: {
				type: DataTypes.INTEGER,
				comment: "工作天數",
			},
			l_i_day: {
				type: DataTypes.INTEGER,
				comment: "勞保天數",
			},
			h_i_day: {
				type: DataTypes.INTEGER,
				comment: "健保天數",
			},
			note: {
				type: DataTypes.STRING(128),
				comment: "備註",
			},
			currency_foreign: {
				type: DataTypes.STRING(128),
        allowNull: true,
				comment: "外幣幣別",
			},
			exchange_rate: {
				type: DataTypes.FLOAT,
				comment: "匯率",
			},
			currency_amount_foreign: {
				type: DataTypes.INTEGER,
				comment: "外幣金額",
			},
			currency_amount_taiwan: {
				type: DataTypes.INTEGER,
				comment: "台幣金額",
			},
			has_trust: {
				type: DataTypes.BOOLEAN,
				comment: "持股信託_YN",
			},
			disabled: {
				type: DataTypes.BOOLEAN,
				comment: "是否禁用",
			},
			create_date: {
				type: DataTypes.DATE,
				comment: "建立日期",
			},
			create_by: {
				type: DataTypes.STRING(128),
				allowNull: true,
				comment: "建立者",
			},
			update_date: {
				type: DataTypes.DATE,
				comment: "修改日期",
			},
			update_by: {
				type: DataTypes.STRING(128),
				allowNull: true,
				comment: "修改者",
			},
		},
		{
			sequelize,
			tableName: "U_TRANSACTION",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}
