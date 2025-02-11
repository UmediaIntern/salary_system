import {
	type EmployeePaymentFEType,
	employeePaymentCreateService,
	type updateEmployeePaymentService,
} from "~/server/api/types/employee_payment_type";
import { EmployeeTrustFEType } from "~/server/api/types/employee_trust_type";

export function convert_employee_trust(data: EmployeeTrustFEType[]) {
    return data.map((item: EmployeeTrustFEType) => {
        let ret = {
            ...item,
        };

        switch (item.emp_no) {
            case "F106008": {ret.emp_trust_reserve = 0;  break;}
            case "F106009": {ret.emp_trust_reserve = 0;  break;}
            case "F106012": {ret.emp_trust_reserve = 0;  break;}
            case "F108003": {ret.emp_trust_reserve = 0;  break;}
            case "F109003": {ret.emp_trust_reserve = 0;  break;}
            case "F109004": {ret.emp_trust_reserve = 0;  break;}
            case "F111002": {ret.emp_trust_reserve = 0;  break;}
            case "F111003": {ret.emp_trust_reserve = 0;  break;}
            case "F111004": {ret.emp_trust_reserve = 0;  break;}
            case "F111006": {ret.emp_trust_reserve = 0;  break;}
            case "F111007": {ret.emp_trust_reserve = 0;  break;}
            case "F111008": {ret.emp_trust_reserve = 0;  break;}
            case "F111009": {ret.emp_trust_reserve = 0;  break;}
            case "F111010": {ret.emp_trust_reserve = 0;  break;}
            case "F111011": {ret.emp_trust_reserve = 0;  break;}
            case "F111012": {ret.emp_trust_reserve = 0;  break;}
            case "F111014": {ret.emp_trust_reserve = 0;  break;}
            case "F111015": {ret.emp_trust_reserve = 0;  break;}
            case "F111017": {ret.emp_trust_reserve = 0;  break;}
            case "F112001": {ret.emp_trust_reserve = 0;  break;}
            case "F112002": {ret.emp_trust_reserve = 0;  break;}
            case "F112003": {ret.emp_trust_reserve = 0;  break;}
            case "F112004": {ret.emp_trust_reserve = 0;  break;}
            case "F112005": {ret.emp_trust_reserve = 0;  break;}
            case "F112006": {ret.emp_trust_reserve = 0;  break;}
            case "F112007": {ret.emp_trust_reserve = 0;  break;}
            case "F112008": {ret.emp_trust_reserve = 0;  break;}
            case "F112009": {ret.emp_trust_reserve = 0;  break;}
            case "F112010": {ret.emp_trust_reserve = 0;  break;}
            case "U093051": {ret.emp_trust_reserve = 500;  break;}
            case "U093052": {ret.emp_trust_reserve = 500;  break;}
            case "U093054": {ret.emp_trust_reserve = 500;  break;}
            case "U093055": {ret.emp_trust_reserve = 500;  break;}
            case "U093061": {ret.emp_trust_reserve = 500;  break;}
            case "U094037": {ret.emp_trust_reserve = 0;  break;}
            case "U094040": {ret.emp_trust_reserve = 500;  break;}
            case "U094041": {ret.emp_trust_reserve = 0;  break;}
            case "U095006": {ret.emp_trust_reserve = 500;  break;}
            case "U095007": {ret.emp_trust_reserve = 0;  break;}
            case "U095008": {ret.emp_trust_reserve = 500;  break;}
            case "U095009": {ret.emp_trust_reserve = 500;  break;}
            case "U096023": {ret.emp_trust_reserve = 500;  break;}
            case "U097002": {ret.emp_trust_reserve = 500;  break;}
            case "U097003": {ret.emp_trust_reserve = 500;  break;}
            case "U097022": {ret.emp_trust_reserve = 0;  break;}
            case "U097026": {ret.emp_trust_reserve = 0;  break;}
            case "U098011": {ret.emp_trust_reserve = 0;  break;}
            case "U098021": {ret.emp_trust_reserve = 0;  break;}
            case "U100003": {ret.emp_trust_reserve = 500;  break;}
            case "U101044": {ret.emp_trust_reserve = 0;  break;}
            case "U101045": {ret.emp_trust_reserve = 500;  break;}
            case "U102004": {ret.emp_trust_reserve = 0;  break;}
            case "U102028": {ret.emp_trust_reserve = 0;  break;}
            case "U102040": {ret.emp_trust_reserve = 0;  break;}
            case "U102041": {ret.emp_trust_reserve = 0;  break;}
            case "U103001": {ret.emp_trust_reserve = 500;  break;}
            case "U103003": {ret.emp_trust_reserve = 500;  break;}
            case "U103025": {ret.emp_trust_reserve = 0;  break;}
            case "U103027": {ret.emp_trust_reserve = 0;  break;}
            case "U103030": {ret.emp_trust_reserve = 0;  break;}
            case "U103032": {ret.emp_trust_reserve = 0;  break;}
            case "U103034": {ret.emp_trust_reserve = 0;  break;}
            case "U103053": {ret.emp_trust_reserve = 0;  break;}
            case "U103057": {ret.emp_trust_reserve = 0;  break;}
            case "U104006": {ret.emp_trust_reserve = 0;  break;}
            case "U104017": {ret.emp_trust_reserve = 0;  break;}
            case "U104027": {ret.emp_trust_reserve = 500;  break;}
            case "U104028": {ret.emp_trust_reserve = 0;  break;}
            case "U104049": {ret.emp_trust_reserve = 0;  break;}
            case "U104054": {ret.emp_trust_reserve = 500;  break;}
            case "U104056": {ret.emp_trust_reserve = 0;  break;}
            case "U105017": {ret.emp_trust_reserve = 0;  break;}
            case "U105035": {ret.emp_trust_reserve = 500;  break;}
            case "U107006": {ret.emp_trust_reserve = 0;  break;}
            case "U107020": {ret.emp_trust_reserve = 500;  break;}
            case "U107023": {ret.emp_trust_reserve = 0;  break;}
            case "U108003": {ret.emp_trust_reserve = 0;  break;}
            case "U108030": {ret.emp_trust_reserve = 0;  break;}
            case "U108042": {ret.emp_trust_reserve = 0;  break;}
            case "U108045": {ret.emp_trust_reserve = 0;  break;}
            case "U108050": {ret.emp_trust_reserve = 500;  break;}
            case "U109017": {ret.emp_trust_reserve = 0;  break;}
            case "U109022": {ret.emp_trust_reserve = 0;  break;}
            case "U110018": {ret.emp_trust_reserve = 500;  break;}
            case "U110021": {ret.emp_trust_reserve = 0;  break;}
            case "U110025": {ret.emp_trust_reserve = 0;  break;}
            case "U110040": {ret.emp_trust_reserve = 500;  break;}
            case "U111009": {ret.emp_trust_reserve = 0;  break;}
            case "U111029": {ret.emp_trust_reserve = 500;  break;}
            case "U112006": {ret.emp_trust_reserve = 0;  break;}
            case "U112020": {ret.emp_trust_reserve = 0;  break;}
            case "U112030": {ret.emp_trust_reserve = 0;  break;}
            case "U113004": {ret.emp_trust_reserve = 0;  break;}
            case "U113010": {ret.emp_trust_reserve = 0;  break;}
            case "U113016": {ret.emp_trust_reserve = 0;  break;}
        }

        return ret;
    });
}


// MARK: convert_employee_payment
export function convert_employee_payment(data: EmployeePaymentFEType[]) {
    return data.map((item: EmployeePaymentFEType) => {
        let ret = {
            ...item,
        };

        switch (item.emp_no) {
            case "F106008": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F106009": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F106012": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F108003": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F109003": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F109004": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F111002": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F111003": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F111004": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F111006": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F111007": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F111008": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F111009": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F111010": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F111011": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F111012": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F111014": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F111015": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F111017": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F112001": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F112002": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F112003": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F112004": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F112005": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F112006": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F112007": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F112008": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F112009": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "F112010": {
                ret.l_i = 27470;
                ret.h_i = 27470;
                ret.l_r = 0;
                ret.occupational_injury = 27470;
                break;
            
            }
            case "U093051": {
                ret.l_i = 45800;
                ret.h_i = 50600;
                ret.l_r = 50600;
                ret.occupational_injury = 50600;
                break;
            
            }
            case "U093052": {
                ret.l_i = 43900;
                ret.h_i = 43900;
                ret.l_r = 43900;
                ret.occupational_injury = 43900;
                break;
            
            }
            case "U093054": {
                ret.l_i = 45800;
                ret.h_i = 53000;
                ret.l_r = 53000;
                ret.occupational_injury = 53000;
                break;
            
            }
            case "U093055": {
                ret.l_i = 43900;
                ret.h_i = 43900;
                ret.l_r = 43900;
                ret.occupational_injury = 43900;
                break;
            
            }
            case "U093061": {
                ret.l_i = 45800;
                ret.h_i = 53000;
                ret.l_r = 53000;
                ret.occupational_injury = 53000;
                break;
            
            }
            case "U094037": {
                ret.l_i = 45800;
                ret.h_i = 60800;
                ret.l_r = 60800;
                ret.occupational_injury = 60800;
                break;
            
            }
            case "U094040": {
                ret.l_i = 45800;
                ret.h_i = 45800;
                ret.l_r = 45800;
                ret.occupational_injury = 45800;
                break;
            
            }
            case "U094041": {
                ret.l_i = 36300;
                ret.h_i = 36300;
                ret.l_r = 36300;
                ret.occupational_injury = 36300;
                break;
            
            }
            case "U095006": {
                ret.l_i = 36300;
                ret.h_i = 36300;
                ret.l_r = 36300;
                ret.occupational_injury = 36300;
                break;
            
            }
            case "U095007": {
                ret.l_i = 34800;
                ret.h_i = 34800;
                ret.l_r = 34800;
                ret.occupational_injury = 34800;
                break;
            
            }
            case "U095008": {
                ret.l_i = 38200;
                ret.h_i = 38200;
                ret.l_r = 38200;
                ret.occupational_injury = 38200;
                break;
            
            }
            case "U095009": {
                ret.l_i = 45800;
                ret.h_i = 45800;
                ret.l_r = 45800;
                ret.occupational_injury = 45800;
                break;
            
            }
            case "U096023": {
                ret.l_i = 36300;
                ret.h_i = 36300;
                ret.l_r = 36300;
                ret.occupational_injury = 36300;
                break;
            
            }
            case "U097002": {
                ret.l_i = 34800;
                ret.h_i = 34800;
                ret.l_r = 34800;
                ret.occupational_injury = 34800;
                break;
            
            }
            case "U097003": {
                ret.l_i = 42000;
                ret.h_i = 42000;
                ret.l_r = 42000;
                ret.occupational_injury = 42000;
                break;
            
            }
            case "U097022": {
                ret.l_i = 38200;
                ret.h_i = 38200;
                ret.l_r = 38200;
                ret.occupational_injury = 38200;
                break;
            
            }
            case "U097026": {
                ret.l_i = 45800;
                ret.h_i = 45800;
                ret.l_r = 45800;
                ret.occupational_injury = 45800;
                break;
            
            }
            case "U098011": {
                ret.l_i = 30300;
                ret.h_i = 30300;
                ret.l_r = 30300;
                ret.occupational_injury = 30300;
                break;
            
            }
            case "U098021": {
                ret.l_i = 36300;
                ret.h_i = 36300;
                ret.l_r = 36300;
                ret.occupational_injury = 36300;
                break;
            
            }
            case "U100003": {
                ret.l_i = 30300;
                ret.h_i = 30300;
                ret.l_r = 30300;
                ret.occupational_injury = 30300;
                break;
            
            }
            case "U101044": {
                ret.l_i = 45800;
                ret.h_i = 45800;
                ret.l_r = 45800;
                ret.occupational_injury = 45800;
                break;
            
            }
            case "U101045": {
                ret.l_i = 43900;
                ret.h_i = 43900;
                ret.l_r = 43900;
                ret.occupational_injury = 43900;
                break;
            
            }
            case "U102004": {
                ret.l_i = 34800;
                ret.h_i = 34800;
                ret.l_r = 34800;
                ret.occupational_injury = 34800;
                break;
            
            }
            case "U102028": {
                ret.l_i = 28800;
                ret.h_i = 28800;
                ret.l_r = 28800;
                ret.occupational_injury = 28800;
                break;
            
            }
            case "U102040": {
                ret.l_i = 31800;
                ret.h_i = 31800;
                ret.l_r = 31800;
                ret.occupational_injury = 31800;
                break;
            
            }
            case "U102041": {
                ret.l_i = 38200;
                ret.h_i = 38200;
                ret.l_r = 38200;
                ret.occupational_injury = 38200;
                break;
            
            }
            case "U103001": {
                ret.l_i = 28800;
                ret.h_i = 28800;
                ret.l_r = 28800;
                ret.occupational_injury = 28800;
                break;
            
            }
            case "U103003": {
                ret.l_i = 34800;
                ret.h_i = 34800;
                ret.l_r = 34800;
                ret.occupational_injury = 34800;
                break;
            
            }
            case "U103025": {
                ret.l_i = 28800;
                ret.h_i = 28800;
                ret.l_r = 28800;
                ret.occupational_injury = 28800;
                break;
            
            }
            case "U103027": {
                ret.l_i = 30300;
                ret.h_i = 30300;
                ret.l_r = 30300;
                ret.occupational_injury = 30300;
                break;
            
            }
            case "U103030": {
                ret.l_i = 27600;
                ret.h_i = 27600;
                ret.l_r = 27600;
                ret.occupational_injury = 27600;
                break;
            
            }
            case "U103032": {
                ret.l_i = 30300;
                ret.h_i = 30300;
                ret.l_r = 30300;
                ret.occupational_injury = 30300;
                break;
            
            }
            case "U103034": {
                ret.l_i = 31800;
                ret.h_i = 31800;
                ret.l_r = 31800;
                ret.occupational_injury = 31800;
                break;
            
            }
            case "U103053": {
                ret.l_i = 31800;
                ret.h_i = 31800;
                ret.l_r = 31800;
                ret.occupational_injury = 31800;
                break;
            
            }
            case "U103057": {
                ret.l_i = 42000;
                ret.h_i = 42000;
                ret.l_r = 42000;
                ret.occupational_injury = 42000;
                break;
            
            }
            case "U104006": {
                ret.l_i = 27600;
                ret.h_i = 27600;
                ret.l_r = 27600;
                ret.occupational_injury = 27600;
                break;
            
            }
            case "U104017": {
                ret.l_i = 40100;
                ret.h_i = 40100;
                ret.l_r = 40100;
                ret.occupational_injury = 40100;
                break;
            
            }
            case "U104027": {
                ret.l_i = 36300;
                ret.h_i = 36300;
                ret.l_r = 36300;
                ret.occupational_injury = 36300;
                break;
            
            }
            case "U104028": {
                ret.l_i = 31800;
                ret.h_i = 31800;
                ret.l_r = 31800;
                ret.occupational_injury = 31800;
                break;
            
            }
            case "U104049": {
                ret.l_i = 30300;
                ret.h_i = 30300;
                ret.l_r = 30300;
                ret.occupational_injury = 30300;
                break;
            
            }
            case "U104054": {
                ret.l_i = 40100;
                ret.h_i = 40100;
                ret.l_r = 40100;
                ret.occupational_injury = 40100;
                break;
            
            }
            case "U104056": {
                ret.l_i = 30300;
                ret.h_i = 30300;
                ret.l_r = 30300;
                ret.occupational_injury = 30300;
                break;
            
            }
            case "U105017": {
                ret.l_i = 31800;
                ret.h_i = 31800;
                ret.l_r = 31800;
                ret.occupational_injury = 31800;
                break;
            
            }
            case "U105035": {
                ret.l_i = 31800;
                ret.h_i = 31800;
                ret.l_r = 31800;
                ret.occupational_injury = 31800;
                break;
            
            }
            case "U107006": {
                ret.l_i = 31800;
                ret.h_i = 31800;
                ret.l_r = 31800;
                ret.occupational_injury = 31800;
                break;
            
            }
            case "U107020": {
                ret.l_i = 45800;
                ret.h_i = 63800;
                ret.l_r = 63800;
                ret.occupational_injury = 63800;
                break;
            
            }
            case "U107023": {
                ret.l_i = 36300;
                ret.h_i = 36300;
                ret.l_r = 36300;
                ret.occupational_injury = 36300;
                break;
            
            }
            case "U108003": {
                ret.l_i = 45800;
                ret.h_i = 48200;
                ret.l_r = 48200;
                ret.occupational_injury = 48200;
                break;
            
            }
            case "U108030": {
                ret.l_i = 34800;
                ret.h_i = 34800;
                ret.l_r = 34800;
                ret.occupational_injury = 34800;
                break;
            
            }
            case "U108042": {
                ret.l_i = 30300;
                ret.h_i = 30300;
                ret.l_r = 30300;
                ret.occupational_injury = 30300;
                break;
            
            }
            case "U108045": {
                ret.l_i = 31800;
                ret.h_i = 31800;
                ret.l_r = 31800;
                ret.occupational_injury = 31800;
                break;
            
            }
            case "U108050": {
                ret.l_i = 45800;
                ret.h_i = 45800;
                ret.l_r = 45800;
                ret.occupational_injury = 45800;
                break;
            
            }
            case "U109017": {
                ret.l_i = 34800;
                ret.h_i = 34800;
                ret.l_r = 34800;
                ret.occupational_injury = 34800;
                break;
            
            }
            case "U109022": {
                ret.l_i = 38200;
                ret.h_i = 38200;
                ret.l_r = 38200;
                ret.occupational_injury = 38200;
                break;
            
            }
            case "U110018": {
                ret.l_i = 33300;
                ret.h_i = 33300;
                ret.l_r = 33300;
                ret.occupational_injury = 33300;
                break;
            
            }
            case "U110021": {
                ret.l_i = 31800;
                ret.h_i = 31800;
                ret.l_r = 31800;
                ret.occupational_injury = 31800;
                break;
            
            }
            case "U110025": {
                ret.l_i = 34800;
                ret.h_i = 34800;
                ret.l_r = 34800;
                ret.occupational_injury = 34800;
                break;
            
            }
            case "U110040": {
                ret.l_i = 45800;
                ret.h_i = 45800;
                ret.l_r = 45800;
                ret.occupational_injury = 45800;
                break;
            
            }
            case "U111009": {
                ret.l_i = 27600;
                ret.h_i = 27600;
                ret.l_r = 27600;
                ret.occupational_injury = 27600;
                break;
            
            }
            case "U111029": {
                ret.l_i = 31800;
                ret.h_i = 31800;
                ret.l_r = 31800;
                ret.occupational_injury = 31800;
                break;
            
            }
            case "U112006": {
                ret.l_i = 36300;
                ret.h_i = 36300;
                ret.l_r = 36300;
                ret.occupational_injury = 36300;
                break;
            
            }
            case "U112020": {
                ret.l_i = 31800;
                ret.h_i = 31800;
                ret.l_r = 31800;
                ret.occupational_injury = 31800;
                break;
            
            }
            case "U112030": {
                ret.l_i = 31800;
                ret.h_i = 31800;
                ret.l_r = 31800;
                ret.occupational_injury = 31800;
                break;
            
            }
            case "U113004": {
                ret.l_i = 34800;
                ret.h_i = 34800;
                ret.l_r = 34800;
                ret.occupational_injury = 34800;
                break;
            
            }
            case "U113010": {
                ret.l_i = 45800;
                ret.h_i = 50600;
                ret.l_r = 50600;
                ret.occupational_injury = 50600;
                break;
            
            }
            case "U113016": {
                ret.l_i = 33300;
                ret.h_i = 33300;
                ret.l_r = 33300;
                ret.occupational_injury = 33300;
                break;
            
            }
        }

        return ret;
    })
}