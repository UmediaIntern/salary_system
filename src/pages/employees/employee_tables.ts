
export const EmployeeTableEnumValues = [
	"TableEmployee",
	"TableEmployeePayment",
	"TableEmployeeTrust",
] as const;

export type EmployeeTableEnum = (typeof EmployeeTableEnumValues)[number]

function getTableName(table: EmployeeTableEnum) {
	switch (table) {
		case "TableEmployee":
			return "employeeData";
		case "TableEmployeePayment":
			return "employeePayment";
		case "TableEmployeeTrust":
			return "employeeTrust";
	}
}

export function getTableNameKey(table: EmployeeTableEnum) {
	return `table_name.${getTableName(table)}`
}

