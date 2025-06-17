import { NextPageWithLayout } from "../_app";
import { ReactElement, useState, useCallback, useEffect, useContext } from "react";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";


/* Functions */
import { useTranslation } from "react-i18next";

/* Components */
import { ExcelUpload } from "~/components/file_operations/excel_upload";
/* ShadCN UI */
import { Button } from "~/components/ui/button";

// Functions
import { 
	getAllowanceList, 
	getBonusList,
	getEmployeeDataList,
	getEmployeePaymentList,
	getEmployeeTrustList,
	getExpenseList,
	getHolidayList,
	getOvertimeList,
	getPaysetList,

} from "./functions/split_data";

// API
import { api } from "~/utils/api";

// TYPE
import { Allowance } from "~/server/database/entity/UMEDIA/allowance";
import { Bonus } from "~/server/database/entity/UMEDIA/bonus";
import { Payset } from "~/server/database/entity/UMEDIA/payset";
import { EmployeeDataDecType } from "~/server/database/entity/SALARY/employee_data";
import { EmployeePaymentDecType } from "~/server/database/entity/SALARY/employee_payment";
import { EmployeeTrustDecType } from "~/server/database/entity/SALARY/employee_trust";
import { Overtime } from "~/server/database/entity/UMEDIA/overtime";
import { Holiday } from "~/server/database/entity/UMEDIA/holiday";
import { Expense } from "~/server/database/entity/UMEDIA/expense";
import ExcelViewer from "../report/salary/excel_viewer";
import { getExcelData } from "../report/salary/utils";
import { t } from "i18next";
import { Header } from "~/components/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";


const DEFAULT_PERIOD = 132;

// SHEET NAMES
const SHEET_ALLOWANCE = "津貼";
const SHEET_BONUS = "獎金";
const SHEET_PAYSET = "工作天數";
const SHEET_EMPLOYEE_DATA = "員工資料";
const SHEET_EMPLOYEE_PAYMENT = "員工薪資";
const SHEET_EMPLOYEE_TRUST = "員工持股信託";
const SHEET_OVERTIME = "加班";
const SHEET_HOLIDAY = "請假";
const SHEET_EXPENSE = "費用";

const SHEET_ALL = "薪資底稿"

const TEST: NextPageWithLayout = () => {	

	const { t } = useTranslation("common");

	const [data, setData] = useState<any>(undefined);
	const [allowanceList, setAllowanceList] = useState<Allowance[]>([]);
	const [bonusList, setBonusList] = useState<Bonus[]>([]);
	const [paysetList, setPaysetList] = useState<Payset[]>([]);
	const [employeeDataList, setEmployeeDataList] = useState<EmployeeDataDecType[]>([]);
	const [employeePaymentList, setEmployeePaymentList] = useState<EmployeePaymentDecType[]>([]);
	const [employeeTrustList, setEmployeeTrustList] = useState<EmployeeTrustDecType[]>([]);
	const [overtimeList, setOvertimeList] = useState<Overtime[]>([]);
	const [holidayList, setHolidayList] = useState<Holiday[]>([]);
	const [expenseList, setExpenseList] = useState<Expense[]>([]);

	const [result, setResult] = useState<any>(undefined);

	// Raw Query
	const attendanceSetting = api.parameters.getCurrentAttendanceSetting.useQuery({ period_id: data ? data.length>0 ? data[0].period_id ?? DEFAULT_PERIOD : DEFAULT_PERIOD : DEFAULT_PERIOD });
	const insuranceSetting = api.parameters.getCurrentInsuranceRateSetting.useQuery({ period_id: data ? data.length>0 ? data[0].period_id ?? DEFAULT_PERIOD : DEFAULT_PERIOD : DEFAULT_PERIOD });
	const allowanceType = api.testTransaction.getAllowanceType.useQuery();
	const bonusType = api.testTransaction.getBonusType.useQuery();
	const expenseTypeList = api.testTransaction.getExpenseTypeList.useQuery();

	const createTransaction = api.testTransaction.testCreateTransaction.useMutation({
		onSuccess: () => {
			console.log("success");
		},
		onError: (error) => {
			console.log("error");
			console.log(error);
		},
	});

	const emp_no_list = data ? data[SHEET_EMPLOYEE_DATA].map((d: any) => d.emp_no) : [];

	

	return (
		<>
			{!result ? <>
				<ExcelUpload
					multiSheet={true} 
					onClick={(data) => {
						setData(data);
						setAllowanceList(getAllowanceList(data[SHEET_ALLOWANCE]));
						setBonusList(getBonusList(data[SHEET_BONUS]));
						setPaysetList(getPaysetList(data[SHEET_PAYSET]));
						setEmployeeDataList(getEmployeeDataList(data[SHEET_EMPLOYEE_DATA]));
						setEmployeePaymentList(getEmployeePaymentList(data[SHEET_EMPLOYEE_PAYMENT]));
						setEmployeeTrustList(getEmployeeTrustList(data[SHEET_EMPLOYEE_TRUST]));
						setOvertimeList(getOvertimeList(data[SHEET_OVERTIME]));
						setHolidayList(getHolidayList(data[SHEET_HOLIDAY]));
						setExpenseList(getExpenseList(data[SHEET_EXPENSE]));
					}}
				/>
				<Button onClick={() => console.log(data)}>
					Console.log(data)
				</Button>
				

				<Button 
					variant={"destructive"}
					onClick={async() => {
						const transaction = await createTransaction.mutateAsync({
							emp_no_list: emp_no_list,
							period_id: DEFAULT_PERIOD,
							issue_date: "2025/01/01",
							pay_type: "month_salary",
							data: data[SHEET_ALL],
			
							// arbitrary employee data
							allowanceList: allowanceList,
							bonusList: bonusList,
							paysetList: paysetList,
							employeeDataList: employeeDataList,
							employeePaymentList: employeePaymentList,
							employeeTrustList: employeeTrustList,
							overtimeList: overtimeList,
							holidayList: holidayList,
							expenseList: expenseList,
						})
						setResult(transaction);
					}}>
					TEST CREATE TRANSACTION
				</Button>
				<Button onClick={() => console.log(expenseTypeList.data)}>console.log(expenseTypeList)</Button>

			</> : 
			<>
				<Button onClick={() => console.log(result)}>console.log(result)</Button>
				<Button onClick={() => console.log(ExcludeDataColumn(result, []))}>console.log(ExcludeDataColumn(result, []))</Button>
				<Button onClick={() => console.log(getExcelData(ExcludeDataColumn(result, [])))}>console.log(getExcelData(ExcludeDataColumn(result, [])))</Button>
				<div className="grow m-4">
					{/* <ExcelViewer 
						original_sheets={
							getExcelData(ExcludeDataColumn(result, []))
						}
						filter_component={<></>}
						selectedSheetIndex={0}
						setSelectedSheetIndex={(index: any) => {console.log(index)}}
					/> */}
				</div>

				<Button onClick={() => setResult(undefined)}>
					回上一頁
				</Button>
			</>
			}
		</>
	);
};

TEST.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="Test">
			<div className="flex h-screen flex-col">
				<Header title={"薪資底稿測試"} showOptions />
				<div className="m-8 h-0 grow rounded-md border-2">
					{page}
				</div>
			</div>
			</PerpageLayoutNav>
		</RootLayout>
	);
};

export default TEST;

function ExcludeDataColumn(dataList: any, excludedColumns: Array<string>) {
	interface keyValuePair {
		[key: string]: any;
	}
	return [
		{name: "test_transaction", data: dataList}
	];
}
