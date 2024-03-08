import { container, injectable } from "tsyringe";
import { EmployeeData } from "../database/entity/SALARY/employee_data";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";
import { Emp } from "../database/entity/UMEDIA/emp";
import { EmployeeDataService } from "./employee_data_service";



export interface CombinedData {
	key: string
   	salary_value: any
   	ehr_value: any
	is_different: boolean
  }
export interface PaidEmployee {
	emp_no: string
	name: string
	department: string
	work_status: string
	quit_date: string | null
	bug?: string
}
export interface PeriodObject {
	PERIOD_NAME: string;
	START_DATE: string;
	END_DATE: string;
}

@injectable()
export class SyncService {
	constructor() {}
	async checkQuitDate(period:number, quit_date: string): Promise<string>  {
		const ehrService = container.resolve(EHRService);
		const periodInfo = await ehrService.getPeriodObject(period) as PeriodObject;
		const current_year = '20'+(periodInfo.PERIOD_NAME).split('-')[1];
		const current_month = periodInfo.PERIOD_NAME.split('-')[0]!;
		const levaing_year = quit_date.split('/')[0]!;
		const leaving_month = quit_date.split('/')[1]!;
		const monthDict: {
			[key: string]: string;
		} = {
			"JAN": "1",
			"FEB": "2",
			"MAR": "3",
			"APR": "4",
			"MAY": "5",
			"JUN": "6",
			"JUL": "7",
			"AUG": "8",
			"SEP": "9",
			"OCT": "10",
			"NOV": "11",
			"DEC": "12"
		}
		if (parseInt(current_year) < parseInt(levaing_year))
			return 'future'
		else if (parseInt(current_year) == parseInt(levaing_year)) {
			if (parseInt(monthDict[current_month]!) < parseInt(leaving_month))
				return 'future'
			else if (parseInt(monthDict[current_month]!) == parseInt(leaving_month))
				return 'current'
			else
				return 'past'
		}
		else
			return 'past'
	}
	async empToEmployee(ehr_data:Emp) {
        let salary_data = new EmployeeData();
		salary_data.emp_no = ehr_data.emp_no!;
		salary_data.emp_name = ehr_data.emp_name!;
		salary_data.position = ehr_data.position!;
		salary_data.position_type = ehr_data.position_type!;
		salary_data.ginsurance_type = ehr_data.ginsurance_type!;
		salary_data.u_dep = ehr_data.u_dep!;
		salary_data.work_type = ehr_data.work_type!;
		salary_data.work_status = ehr_data.work_status!;
		salary_data.accessible = ehr_data.accessible!;
		salary_data.sex_type = ehr_data.sex_type!;
		salary_data.dependents = ehr_data.dependents!;
		salary_data.healthcare = ehr_data.healthcare!;
		salary_data.registration_date = ehr_data.registration_date!;
		salary_data.quit_date = ehr_data.quit_date!;
		salary_data.licens_id = ehr_data.licens_id!;
		salary_data.nbanknumber = ehr_data.nbanknumber!;
		return salary_data
	}

	//stage1
	async getCandPaidEmployees(func: string, period:number): Promise<PaidEmployee[]> {
		let cand_paid_emps: PaidEmployee[] = [];
		const ehrService = container.resolve(EHRService);
		const pay_work_status = ["一般員工", "當月離職人員_破月", "當月離職人員_全月"];
		if (func == "month_salary") {
			let salary_emps = await EmployeeData.findAll({
				attributes: [ "emp_name", "u_dep","emp_no", "work_status", "quit_date"],
			});
            salary_emps = salary_emps.filter((emp) => {
                return pay_work_status.includes(emp.work_status!)
            })
			let ehr_emps = await ehrService.getEmp(period);
			console.log("ehr_emps:");
			console.log(ehr_emps);
			// Step 1: Create a dictionary for ehr_emps
			interface EHRDictType {
				[key: string]: any;
			};
			const ehrDict: EHRDictType = {};
			ehr_emps.forEach(emp => {
				ehrDict[emp.emp_no!] = emp;
			});

			// Step 2: Replace corresponding records in salary_emps with ehr_emps
			const updatedSalaryEmps = await Promise.all(
                salary_emps.map(async salaryEmp => {
				    const matchingEhrEmp = ehrDict[salaryEmp.emp_no];
				    return matchingEhrEmp ? await this.empToEmployee(matchingEhrEmp) : salaryEmp;
			    })
            );

			// Step 3: Filter ehr_emps to get only the new employees
			// const newEmployees = ehr_emps.filter(emp => emp.work_status == '當月新進人員全月' || emp.work_status == '當月新進人員破月');
			let newEmps: Array<Emp> = [];
			ehr_emps.map(emp => {
				Object.keys(emp).map((key) => {
					//console.log(key);
					//console.log((emp as any)[key]);
				})
				if(emp.change_flag == '當月新進')
					newEmps.push(emp);
				// else
					//console.log(emp.change_flag);
			});
            const newEmployees = await Promise.all(newEmps.map(async (emp) => await this.empToEmployee(emp)));
			// newEmployees = newEmployees.filter((emp: Emp) => emp !== undefined); 
			//console.log("newEmployees:");
			//console.log(newEmployees);
            // const empDataService = container.resolve(EmployeeDataService);
			// newEmployees.map(emp => {
			// 	empDataService.createEmployeeData({
			// 		emp_no: emp.emp_no!,
			// 		emp_name: emp.emp_name!,
			// 		position: emp.position!,
			// 		position_type: emp.position_type!,
			// 		ginsurance_type: emp.ginsurance_type!,
			// 		u_dep: emp.u_dep!,
			// 		work_type: emp.work_type!,
			// 		work_status: emp.work_status!,
			// 		accesible: emp.accesible!,
			// 		sex_type: emp.sex_type!,
			// 		dependents: emp.dependents!,
			// 		healthcare: emp.healthcare!,
			// 		registration_date: emp.registration_date!,
			// 		quit_date: emp.quit_date!,
			// 		licens_id: emp.licens_id!,
			// 		nbanknumber: emp.nbanknumber!
			// 	})
			// })
			// Step 4: Concatenate updatedSalaryEmps and newEmployees to get all_emps
			const all_emps = updatedSalaryEmps.concat(newEmployees);

			// Output or use all_emps as needed
			//console.log('check all emps:')
			//console.log(all_emps);
			let msg=''
			cand_paid_emps = await Promise.all(all_emps.map(async (emp) => {
				switch (emp.work_type) {
					case "一般員工":
						if (emp.quit_date != null) {
							if( await this.checkQuitDate(period, emp.quit_date) !='future'){
								msg = '一般員工卻有不合理離職日期('+emp.quit_date+')';
							}
						}
						break;
					case "當月離職人員_破月":
						if (emp.quit_date == null) {
							msg = '當月離職人員卻沒有離職日期'
						}
						else {
							if ( await this.checkQuitDate(period, emp.quit_date) !='current'){
								msg = '當月離職人員卻有不合理離職日期('+emp.quit_date+')';
							}
						}
						break;
					case "當月離職人員_全月":
						if (emp.quit_date == null) {
							msg = '當月離職人員卻沒有離職日期'
						}
						else {
							if ( await this.checkQuitDate(period, emp.quit_date) !='current'){
								msg = '當月離職人員卻有不合理離職日期('+emp.quit_date+')';
							}
						}
						break;
					case "離職人員":
						if (emp.quit_date == null) {
							msg = '離職人員卻沒有離職日期'
						}
						else {
							if ( await this.checkQuitDate(period, emp.quit_date) !='past'){
								msg = '離職人員卻有不合理離職日期('+emp.quit_date+')';
							}
						}
				}
				const cand_paid_emp : PaidEmployee = {
					emp_no: emp.emp_no,
					name: emp.emp_name,
					department: emp.u_dep,
					work_status: emp.work_status,
					quit_date: emp.quit_date,
					bug: (msg!='')?msg:undefined
				}
				return cand_paid_emp
			}))
		}
		return cand_paid_emps
	}
	//stage2
	async checkEmployeeData(
		func: string,
		period: number,
	): Promise<CombinedData[][] | undefined> {
		const ehrService = container.resolve(EHRService);
		let salary_datas = [];

		const cand_paid_emps = await this.getCandPaidEmployees(func, period);
		const cand_emp_nos = cand_paid_emps.map((emp) => emp.emp_no);
		if (func == "month_salary") {
			salary_datas = await EmployeeData.findAll({
				where: {
					emp_no: {
						[Op.in]: cand_emp_nos,
					}
				}
			});
		} else {
			salary_datas = await EmployeeData.findAll({});
		}
		const ehr_datas = await ehrService.getEmp(period);
		interface EmpDictType {
			[key: string]: any;
		};
		const ehrDict: EmpDictType = {};
        const salaryDict: EmpDictType = {};
		ehr_datas.forEach(emp => {
			ehrDict[emp.emp_no!] = emp;
		});
        salary_datas.forEach(emp => {
            salaryDict[emp.emp_no!] = emp;
        })
		const changedDatas = await Promise.all(
			cand_emp_nos.map(async (cand_emp_no: string) => {
                const excludedKeys = [
                    "id",
                    "create_date",
                    "create_by",
                    "update_date",
                    "update_by",
                ];
				if (!ehrDict[cand_emp_no]) {
					return undefined;
				}
                else if (!salaryDict[cand_emp_no]) {
                    const employee_data = await this.empToEmployee(ehrDict[cand_emp_no])
                    const keys = Object.keys(employee_data.dataValues);
                    const combinedDatas = await Promise.all(
                        keys.map(async (key) => {
                            console.log("key :" + key)
                            const salary_value = undefined;
                            console.log("salary_value :" + salary_value)
                            const ehr_value = (ehrDict[cand_emp_no] as any)[key];
                            console.log("ehr_value :" + ehr_value)
                            const is_different =
                                !excludedKeys.includes(key) &&
                                salary_value !== ehr_value;
                            console.log("is_different :" + is_different)
                            const combinedData: CombinedData = {
                                key: key,
                                salary_value: salary_value,
                                ehr_value: ehr_value,
                                is_different: is_different,
                            };
                            return combinedData;
                        })
                    );
                    return combinedDatas;
                }
                else{
                    const salary_data = salaryDict[cand_emp_no];
                    const keys = Object.keys(salary_data.dataValues);
                    const combinedDatas = await Promise.all(
                        keys.map(async (key) => {
                            console.log("key :" + key)
                            const salary_value = (salary_data as any)[key];
                            console.log("salary_value :" + salary_value)
                            const ehr_value = (ehrDict[salary_data.emp_no] as any)[key];
                            console.log("ehr_value :" + ehr_value)
                            const is_different =
                                !excludedKeys.includes(key) &&
                                salary_value !== ehr_value;
                            console.log("is_different :" + is_different)
                            const combinedData: CombinedData = {
                                key: key,
                                salary_value: salary_value,
                                ehr_value: ehr_value,
                                is_different: is_different,
                            };
                            return combinedData;
                        })
                    );
                    if (
                        combinedDatas.some(
                            (combinedData) => (combinedData.is_different) === true
                        )
                    ) {
                        return combinedDatas;
                    }
                    return undefined; // Explicitly return undefined for the cases where db_data is equal to ehrData
                }
			})
		);
		// Filter out the undefined values
		const filteredChangeDatas = changedDatas.filter(
			(data): data is CombinedData[] => data !== undefined
		);
		return filteredChangeDatas;
	}
    async syncronize(period:number, emp_nos: string[]) {
        const ehrService = container.resolve(EHRService);
        const ehr_datas = await ehrService.getEmp(period);
        interface EHRDictType {
            [key: string]: any;
        };
        const ehrDict: EHRDictType = {};
        ehr_datas.forEach(emp => {
            ehrDict[emp.emp_no!] = emp;
        });
        const changeDatas = await Promise.all(
            emp_nos.map(async (emp_no: string) => {
                const changeData = await this.empToEmployee(ehrDict[emp_no])
                return changeData
            })
        );
        const employee_data_service = container.resolve(EmployeeDataService);
        changeDatas.map(async (changeData) => {
            await employee_data_service.updateEmployeeDataByEmpNO(changeData)
        })
        return changeDatas
    }
	//stage3
	async getPaidEmps(func: string) : Promise<EmployeeData[]> {
		// if (func == "month") {
			const paid_status=["一般員工","當月離職人員_全月","當月離職人員_破月"]
			const paid_emps = await EmployeeData.findAll({
				where: {
					work_status: {
						[Op.in]: paid_status
					}
				},
			})
			return paid_emps
		// }
	}
}