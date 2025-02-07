import { api } from "~/utils/api";

const ctx = api.useUtils();

// Employee Payment
export const updateEmployeePayment =
	api.employeePayment.updateEmployeePayment.useMutation({
		onSuccess: () => {
			void ctx.employeePayment.invalidate();
		},
	});

export const createEmployeePayment =
	api.employeePayment.createEmployeePayment.useMutation({
		onSuccess: () => {
			void ctx.employeePayment.invalidate();
		},
	});

export const deleteEmployeePayment =
	api.employeePayment.deleteEmployeePayment.useMutation({
		onSuccess: () => {
			void ctx.employeePayment.invalidate();
		},
	});

export const autoCalculateEmployeePayment =
	api.employeePayment.autoCalculateEmployeePayment.useMutation({
		onSuccess: () => {
			void ctx.employeePayment.invalidate();
		},
	});

// Employee Trust
export const deleteEmployeeTrust = api.employeeTrust.deleteEmployeeTrust.useMutation({
	onSuccess: () => {
		void ctx.employeeTrust.invalidate();
	},
});

export const updateEmployeeTrust = api.employeeTrust.updateEmployeeTrust.useMutation({
	onSuccess: () => {
		void ctx.employeeTrust.invalidate();
	},
});

export const createEmployeeTrust = api.employeeTrust.createEmployeeTrust.useMutation({
	onSuccess: () => {
		void ctx.employeeTrust.invalidate();
	},
});
