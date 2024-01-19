import React, { createContext, PropsWithChildren, useEffect } from "react";
import * as TN from "~/pages/table_names";
import { api } from "~/utils/api";
import TableEnum from "../context/data_table_enum";
import { ShowTableEnum } from "../../shown_tables";
import { UseTRPCMutationResult, UseTRPCQueryResult } from "@trpc/react-query/shared";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

interface FunctionsApi {
	queryFunction: (() => UseTRPCQueryResult<any, any>) | undefined;
	updateFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	createFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	deleteFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
}

export const toolbarFunctionsContext = createContext<FunctionsApi>({
	queryFunction: undefined,
	updateFunction: undefined,
	createFunction: undefined,
	deleteFunction: undefined,
});

interface ToolbarFunctionsProviderProps {
	selectedTable: ShowTableEnum;
}

export default function ToolbarFunctionsProvider({
	children,
	selectedTable,
}: PropsWithChildren<ToolbarFunctionsProviderProps>) {
	const ctx = api.useContext();

	//#region <AttendanceSetting>
	const getAttendanceSetting = () =>
		api.parameters.getCurrentAttendanceSetting.useQuery();
	const updateAttendanceSetting =
		api.parameters.updateAttendanceSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAttendanceSetting.invalidate();
			},
		});
	const createAttendanceSetting =
		api.parameters.createAttendanceSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAttendanceSetting.invalidate();
			},
		});
	const deleteAttendanceSetting =
		api.parameters.deleteAttendanceSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAttendanceSetting.invalidate();
			},
		});
	//#endregion

	//#region <BankSetting>
	const getBankSetting = () =>
		api.parameters.getCurrentBankSetting.useQuery();
	const updateBankSetting = api.parameters.updateBankSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBankSetting.invalidate();
		},
	});
	const createBankSetting = api.parameters.createBankSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBankSetting.invalidate();
		},
	});
	const deleteBankSetting = api.parameters.deleteBankSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBankSetting.invalidate();
		},
	});
	//#endregion

	//#region <InsuranceSetting>
	const getInsuranceRateSetting = () =>
		api.parameters.getCurrentInsuranceRateSetting.useQuery();
	const updateInsuranceRateSetting =
		api.parameters.updateInsuranceRateSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentInsuranceRateSetting.invalidate();
			},
		});
	const createInsuranceRateSetting =
		api.parameters.createInsuranceRateSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentInsuranceRateSetting.invalidate();
			},
		});
	const deleteInsuranceRateSetting =
		api.parameters.deleteInsuranceRateSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentInsuranceRateSetting.invalidate();
			},
		});
	//#endregion

	//#region <BonusSetting>
	const getBonusSetting = () =>
		api.parameters.getCurrentBonusSetting.useQuery();
	const updateBonusSetting = api.parameters.updateBonusSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBonusSetting.invalidate();
		},
	});
	const createBonusSetting = api.parameters.createBonusSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBonusSetting.invalidate();
		},
	});
	const deleteBonusSetting = api.parameters.deleteBonusSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBonusSetting.invalidate();
		},
	});
	//#endregion

	//#region <BonusDepartment>
	const getBonusDepartment = () =>
		api.parameters.getCurrentBonusDepartment.useQuery();
	const updateBonusDepartment =
		api.parameters.updateBonusDepartment.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusDepartment.invalidate();
			},
		});
	const createBonusDepartment =
		api.parameters.createBonusDepartment.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusDepartment.invalidate();
			},
		});
	const deleteBonusDepartment =
		api.parameters.deleteBonusDepartment.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusDepartment.invalidate();
			},
		});
	//#endregion

	//#region <BonusPosition>
	const getBonusPosition = () =>
		api.parameters.getCurrentBonusPosition.useQuery();
	const updateBonusPosition = api.parameters.updateBonusPosition.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBonusPosition.invalidate();
		},
	});
	const createBonusPosition = api.parameters.createBonusPosition.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBonusPosition.invalidate();
		},
	});
	const deleteBonusPosition = api.parameters.deleteBonusPosition.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBonusPosition.invalidate();
		},
	});
	//#endregion

	//#region <BonusPositionType>
	const getBonusPositionType = () =>
		api.parameters.getCurrentBonusPositionType.useQuery();
	const updateBonusPositionType =
		api.parameters.updateBonusPositionType.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusPositionType.invalidate();
			},
		});
	const createBonusPositionType =
		api.parameters.createBonusPositionType.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusPositionType.invalidate();
			},
		});
	const deleteBonusPositionType =
		api.parameters.deleteBonusPositionType.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusPositionType.invalidate();
			},
		});
	//#endregion

	//#region <BonusSeniority>
	const getBonusSeniority = () =>
		api.parameters.getCurrentBonusSeniority.useQuery();
	const updateBonusSeniority =
		api.parameters.updateBonusSeniority.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusSeniority.invalidate();
			},
		});
	const createBonusSeniority =
		api.parameters.createBonusSeniority.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusSeniority.invalidate();
			},
		});
	const deleteBonusSeniority =
		api.parameters.deleteBonusSeniority.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentBonusSeniority.invalidate();
			},
		});

	const functionsDictionary: Record<ShowTableEnum, FunctionsApi> = {
		TableAttendance: {
			queryFunction: getAttendanceSetting,
			updateFunction: updateAttendanceSetting,
			createFunction: createAttendanceSetting,
			deleteFunction: deleteAttendanceSetting,
		},
		TableBankSetting: {
			queryFunction: getBankSetting,
			updateFunction: updateBankSetting,
			createFunction: createBankSetting,
			deleteFunction: deleteBankSetting,
		},
		TableInsurance: {
			queryFunction: getInsuranceRateSetting,
			updateFunction: updateInsuranceRateSetting,
			createFunction: createInsuranceRateSetting,
			deleteFunction: deleteInsuranceRateSetting,
		},
		TableBonusSetting: {
			queryFunction: getBonusSetting,
			updateFunction: updateBonusSetting,
			createFunction: createBonusSetting,
			deleteFunction: deleteBonusSetting,
		},
		TableBonusDepartment: {
			queryFunction: getBonusDepartment,
			updateFunction: updateBonusDepartment,
			createFunction: createBonusDepartment,
			deleteFunction: deleteBonusDepartment,
		},
		TableBonusPosition: {
			queryFunction: getBonusPosition,
			updateFunction: updateBonusPosition,
			createFunction: createBonusPosition,
			deleteFunction: deleteBonusPosition,
		},
		TableBonusPositionType: {
			queryFunction: getBonusPositionType,
			updateFunction: updateBonusPositionType,
			createFunction: createBonusPositionType,
			deleteFunction: deleteBonusPositionType,
		},
		TableBonusSeniority: {
			queryFunction: getBonusSeniority,
			updateFunction: updateBonusSeniority,
			createFunction: createBonusSeniority,
			deleteFunction: deleteBonusSeniority,
		},
	};

	// Return the provider with the functions
	return (
		<toolbarFunctionsContext.Provider
			value={functionsDictionary[selectedTable]}
		>
			{children}
		</toolbarFunctionsContext.Provider>
	);
}
