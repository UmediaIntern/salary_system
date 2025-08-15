import React, { createContext, type PropsWithChildren } from "react";
import { api } from "~/utils/api";
import { type ParameterTableEnum } from "../../parameter_tables";
import { type UseTRPCQueryResult } from "@trpc/react-query/shared";
import { type TRPCClientErrorLike } from "@trpc/client";

interface QueryFunctionsApi {
	queryFunction:
	| (() => UseTRPCQueryResult<any[], TRPCClientErrorLike<any>>)
	| undefined;
}

export const apiFunctionsContext = createContext<QueryFunctionsApi>({
	queryFunction: undefined,
});

interface ApiFunctionsProviderProps {
	selectedTableType: ParameterTableEnum;
}

export default function ApiFunctionsProvider({
	children,
	selectedTableType,
}: PropsWithChildren<ApiFunctionsProviderProps>) {
	const getAttendanceSetting = () =>
		api.parameters.getAllAttendanceSetting.useQuery();

	const getBankSetting = () => api.parameters.getAllBankSetting.useQuery();

	const getInsuranceRateSetting = () =>
		api.parameters.getAllInsuranceRateSetting.useQuery();

	const getTrustMoney = () => api.parameters.getAllTrustMoney.useQuery();

	const getLevelRange = () =>
		api.parameters.getAllLevelRange.useQuery();

	const getLevel = () =>
		api.parameters.getAllLevel.useQuery();

	const getSalaryIncomeTax = () =>
		api.parameters.getAllSalaryIncomeTax.useQuery();

	const getIncomeTaxSetting = () =>
		api.parameters.getAllIncomeTaxSetting.useQuery();

	const getAllowanceRange = () =>
		api.parameters.getAllAllowanceRange.useQuery();

	const functionsDictionary: Record<ParameterTableEnum, QueryFunctionsApi> = {
		TableAttendance: {
			queryFunction: getAttendanceSetting,
		},
		TableBankSetting: {
			queryFunction: getBankSetting,
		},
		TableInsurance: {
			queryFunction: getInsuranceRateSetting,
		},
		TableTrustMoney: {
			queryFunction: getTrustMoney,
		},
		TableLevelRange: {
			queryFunction: getLevelRange,
		},
		TableLevel: {
			queryFunction: getLevel,
		},
		TableSalaryIncomeTax: {
			queryFunction: getSalaryIncomeTax,
		},
		TableIncomeTaxSetting: {
			queryFunction: getIncomeTaxSetting,
		},
		TableAllowanceRange: {
			queryFunction: getAllowanceRange,
		},
	};

	// Return the provider with the functions
	return (
		<apiFunctionsContext.Provider
			value={functionsDictionary[selectedTableType]}
		>
			{children}
		</apiFunctionsContext.Provider>
	);
}
