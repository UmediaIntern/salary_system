import { z } from "zod";
import {
	WorkStatusEnum,
	WorkStatusEnumType,
} from "~/server/api/types/work_status_enum";
import {
	WorkTypeEnumType,
	WorkTypeEnum,
} from "~/server/api/types/work_type_enum";
import { stringToEnum } from "~/server/api/types/z_utils";
import { get_date_string } from "~/server/service/helper_function";

const dbEmpAll = z.object({
	EMPLOYEE_NO: z.string(),
	NAME: z.string(),
	POSITION: z.number(),
	POSITION_TYPE: z.string(),
	GIN: z.string(),
	USER_YIM: z.string().default("MISSING"),
	DL_IDL: stringToEnum.pipe(WorkTypeEnum),
	WORK_STATUS: stringToEnum
		.pipe(WorkStatusEnum)
		.default(WorkStatusEnum.Enum.RegularEmployee),
	ACCESSIBLE: z
		.string()
		.nullable()
		.transform((value) => (value !== "0" ? value : null)),
	SEX_TYPE: z.string(),
	扶養人數: z.number().nullable(),
	健保眷口數: z.number().nullable(),
	REGISTRATION_DATE: z.date(),
	LEAVE_DATE: z.date().nullable(),
	LICENS_ID: z.string(),
	NBANKNUMBER: z.string().default("MISSING"),
});

export class EmpAll {
	// id can be undefined during creation when using `autoIncrement`
	emp_no: string;
	emp_name: string;
	position: number;
	position_type: string;
	group_insurance_type: string;
	department: string;
	work_type: WorkTypeEnumType;
	work_status: WorkStatusEnumType;
	disabilty_level: string | null;
	sex_type: string;
	dependents: number | null;
	healthcare_dependents: number | null; //健保眷口數
	registration_date: string;
	quit_date: string | null;
	license_id: string | null;
	bank_account_taiwan: string;
	bank_account_foreign: string | null;
	received_elderly_benefits: boolean;

	constructor(
		emp_no: string,
		emp_name: string,
		position: number,
		position_type: string,
		group_insurance_type: string,
		department: string,
		work_type: WorkTypeEnumType,
		work_status: WorkStatusEnumType,
		disabilty_level: string | null,
		sex_type: string,
		dependents: number | null,
		healthcare_dependents: number | null,
		registration_date: string,
		quit_date: string | null,
		license_id: string | null,
		bank_account_taiwan: string,
		bank_account_foreign: string,
		received_elderly_benefits: boolean
	) {
		this.emp_no = emp_no;
		this.emp_name = emp_name;
		this.position = position;
		this.position_type = position_type;
		this.group_insurance_type = group_insurance_type;
		this.department = department;
		this.work_type = work_type;
		this.work_status = work_status;
		this.disabilty_level = disabilty_level;
		this.sex_type = sex_type;
		this.dependents = dependents;
		this.healthcare_dependents = healthcare_dependents;
		this.registration_date = registration_date;
		this.quit_date = quit_date;
		this.license_id = license_id;
		this.bank_account_taiwan = bank_account_taiwan;
		this.bank_account_foreign = bank_account_foreign;
		this.received_elderly_benefits = received_elderly_benefits;
	}

	static fromDB(db_data: any): EmpAll {
		const result = dbEmpAll.safeParse(db_data);

        // USER_YIM: db_data.USER_YIM ?? "MISSING",
        // WORK_STATUS: db_data.WORK_STATUS ?? "一般員工",
        // ACCESSIBLE: db_data.ACCESSIBLE !== 0 ? db_data.ACCESSIBLE : null,
        // NBANKNUMBER: db_data.NBANKNUMBER ?? "MISSING",

		if (!result.success) {
			throw new Error(result.error.message);
		}

		const data = result.data;

		// Format the date string from yy-mm-ddThh:mm:ss to yyyy-mm-dd
		const FORMAT_REGISTRATION_DATE = get_date_string(
			data.REGISTRATION_DATE
		);
		const FORMAT_QUIT_DATE = data.LEAVE_DATE
			? get_date_string(data.LEAVE_DATE)
			: null;

		return new EmpAll(
			data.EMPLOYEE_NO,
			data.NAME,
			data.POSITION,
			data.POSITION_TYPE,
			data.GIN,
			data.USER_YIM,
			data.DL_IDL,
			data.WORK_STATUS,
			data.ACCESSIBLE,
			data.SEX_TYPE,
			data.扶養人數,
			data.健保眷口數,
			FORMAT_REGISTRATION_DATE,
			FORMAT_QUIT_DATE,
			data.LICENS_ID,
			data.NBANKNUMBER,
			"",
			false
		);
	}
}
