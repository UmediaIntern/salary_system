import React, { createContext, PropsWithChildren, useContext } from "react";
import { api } from "~/utils/api";
import { ParameterTableEnum } from "../../parameter_tables";
import {
	UseTRPCMutationResult,
	UseTRPCQueryResult,
} from "@trpc/react-query/shared";

interface FunctionsApi {
	queryCurrentFunction: (() => UseTRPCQueryResult<any, any>) | undefined;
	queryFutureFunction: (() => UseTRPCQueryResult<any, any>) | undefined;
	updateFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	createFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	deleteFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	batchCreateFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
}

export const parameterToolbarFunctionsContext = createContext<FunctionsApi>({
	queryCurrentFunction: undefined,
	queryFutureFunction: undefined,
	updateFunction: undefined,
	createFunction: undefined,
	deleteFunction: undefined,
	batchCreateFunction: undefined,
});

interface ToolbarFunctionsProviderProps {
	selectedTableType: ParameterTableEnum;
	period_id: number;
}

export default function ParameterToolbarFunctionsProvider({
	children,
	selectedTableType,
	period_id,
}: PropsWithChildren<ToolbarFunctionsProviderProps>) {
	const ctx = api.useUtils();

	//#region <AttendanceSetting>
	const getCurrentAttendanceSetting = () =>
		api.parameters.getCurrentAttendanceSetting.useQuery({ period_id });
	const getFutureAttendanceSetting = () =>
		api.parameters.getAllFutureAttendanceSetting.useQuery();
	const updateAttendanceSetting =
		api.parameters.updateAttendanceSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAttendanceSetting.invalidate();
				ctx.parameters.getAllAttendanceSetting.invalidate();
				ctx.parameters.getAllFutureAttendanceSetting.invalidate();
			},
		});
	const createAttendanceSetting =
		api.parameters.createAttendanceSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAttendanceSetting.invalidate();
				ctx.parameters.getAllAttendanceSetting.invalidate();
				ctx.parameters.getAllFutureAttendanceSetting.invalidate();
			},
		});
	const deleteAttendanceSetting =
		api.parameters.deleteAttendanceSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAttendanceSetting.invalidate();
				ctx.parameters.getAllAttendanceSetting.invalidate();
				ctx.parameters.getAllFutureAttendanceSetting.invalidate();
			},
		});
	//#endregion

	//#region <BankSetting>
	const getCurrentBankSetting = () =>
		api.parameters.getCurrentBankSetting.useQuery({ period_id });
	const getFutureBankSetting = () =>
		api.parameters.getAllFutureBankSetting.useQuery();
	const updateBankSetting = api.parameters.updateBankSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBankSetting.invalidate();
			ctx.parameters.getAllBankSetting.invalidate();
			ctx.parameters.getAllFutureBankSetting.invalidate();
		},
	});
	const createBankSetting = api.parameters.createBankSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBankSetting.invalidate();
			ctx.parameters.getAllBankSetting.invalidate();
			ctx.parameters.getAllFutureBankSetting.invalidate();
		},
	});
	const batchCreateBankSetting = api.parameters.batchCreateBankSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBankSetting.invalidate();
			ctx.parameters.getAllBankSetting.invalidate();
			ctx.parameters.getAllFutureBankSetting.invalidate();
		},
	})
	const deleteBankSetting = api.parameters.deleteBankSetting.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentBankSetting.invalidate();
			ctx.parameters.getAllBankSetting.invalidate();
			ctx.parameters.getAllFutureBankSetting.invalidate();
		},
	});
	//#endregion

	//#region <InsuranceSetting>
	const getCurrentInsuranceRateSetting = () =>
		api.parameters.getCurrentInsuranceRateSetting.useQuery({ period_id });
	const getFutureInsuranceRateSetting = () =>
		api.parameters.getAllFutureInsuranceRateSetting.useQuery();
	const updateInsuranceRateSetting =
		api.parameters.updateInsuranceRateSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentInsuranceRateSetting.invalidate();
				ctx.parameters.getAllInsuranceRateSetting.invalidate();
				ctx.parameters.getAllFutureInsuranceRateSetting.invalidate();
			},
		});
	const createInsuranceRateSetting =
		api.parameters.createInsuranceRateSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentInsuranceRateSetting.invalidate();
				ctx.parameters.getAllInsuranceRateSetting.invalidate();
				ctx.parameters.getAllFutureInsuranceRateSetting.invalidate();
			},
		});
	const deleteInsuranceRateSetting =
		api.parameters.deleteInsuranceRateSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentInsuranceRateSetting.invalidate();
				ctx.parameters.getAllInsuranceRateSetting.invalidate();
				ctx.parameters.getAllFutureInsuranceRateSetting.invalidate();
			},
		});
	//#endregion

	//#region <TrustMoneySetting>
	const getCurrentTrustMoneySetting = () =>
		api.parameters.getCurrentTrustMoney.useQuery({ period_id });
	const getFutureTrustMoneySetting = () =>
		api.parameters.getAllFutureTrustMoney.useQuery();
	const updateTrustMoneySetting =
		api.parameters.updateTrustMoney.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentTrustMoney.invalidate();
				ctx.parameters.getAllTrustMoney.invalidate();
				ctx.parameters.getAllFutureTrustMoney.invalidate();
			},
		});
	const createTrustMoneySetting =
		api.parameters.createTrustMoney.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentTrustMoney.invalidate();
				ctx.parameters.getAllTrustMoney.invalidate();
				ctx.parameters.getAllFutureTrustMoney.invalidate();
			},
		});
	const batchCreateTrustMoneySetting =
		api.parameters.batchCreateTrustMoney.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentTrustMoney.invalidate();
				ctx.parameters.getAllTrustMoney.invalidate();
				ctx.parameters.getAllFutureTrustMoney.invalidate();
			}
		})
	const deleteTrustMoneySetting =
		api.parameters.deleteTrustMoney.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentTrustMoney.invalidate();
				ctx.parameters.getAllTrustMoney.invalidate();
				ctx.parameters.getAllFutureTrustMoney.invalidate();
			},
		});
	//#endregion

	const getCurrentLevel = () => api.parameters.getCurrentLevel.useQuery({ period_id });
	const getFutureLevel = () => api.parameters.getAllFutureLevel.useQuery();
	const updateLevel = api.parameters.updateLevel.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentLevel.invalidate();
			ctx.parameters.getAllLevel.invalidate();
			ctx.parameters.getAllFutureLevel.invalidate();
		},
	});
	const createLevel = api.parameters.createLevel.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentLevel.invalidate();
			ctx.parameters.getAllLevel.invalidate();
			ctx.parameters.getAllFutureLevel.invalidate();
		},
	});
	const batchCreateLevel = api.parameters.batchCreateLevel.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentLevel.invalidate();
			ctx.parameters.getAllLevel.invalidate();
			ctx.parameters.getAllFutureLevel.invalidate();
		}
	})
	const deleteLevel = api.parameters.deleteLevel.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentLevel.invalidate();
			ctx.parameters.getAllLevel.invalidate();
			ctx.parameters.getAllFutureLevel.invalidate();
		},
	});
	const getCurrentLevelRange = () => api.parameters.getCurrentLevelRange.useQuery({ period_id });
	const getFutureLevelRange = () => api.parameters.getAllFutureLevelRange.useQuery();
	const updateLevelRange = api.parameters.updateLevelRange.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentLevelRange.invalidate();
			ctx.parameters.getAllLevelRange.invalidate();
			ctx.parameters.getAllFutureLevelRange.invalidate();
		},
	});
	const createLevelRange = api.parameters.createLevelRange.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentLevelRange.invalidate();
			ctx.parameters.getAllLevelRange.invalidate();
			ctx.parameters.getAllFutureLevelRange.invalidate();
		},
	});
	const batchCreateLevelRange = api.parameters.batchCreateLevelRange.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentLevelRange.invalidate();
			ctx.parameters.getAllLevelRange.invalidate();
			ctx.parameters.getAllFutureLevelRange.invalidate();
		}
	})
	const deleteLevelRange = api.parameters.deleteLevelRange.useMutation({
		onSuccess: () => {
			ctx.parameters.getCurrentLevelRange.invalidate();
			ctx.parameters.getAllLevelRange.invalidate();
			ctx.parameters.getAllFutureLevelRange.invalidate();
		},
	});

	//#region <SalaryIncomeTax>
	const getCurrentSalaryIncomeTax = () =>
		api.parameters.getCurrentSalaryIncomeTax.useQuery({ period_id });
	const getFutureSalaryIncomeTax = () =>
		api.parameters.getAllFutureSalaryIncomeTax.useQuery();
	const updateSalaryIncomeTax =
		api.parameters.updateSalaryIncomeTax.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentSalaryIncomeTax.invalidate();
				ctx.parameters.getAllSalaryIncomeTax.invalidate();
				ctx.parameters.getAllFutureSalaryIncomeTax.invalidate();
			},
		});
	const createSalaryIncomeTax =
		api.parameters.createSalaryIncomeTax.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentSalaryIncomeTax.invalidate();
				ctx.parameters.getAllSalaryIncomeTax.invalidate();
				ctx.parameters.getAllFutureSalaryIncomeTax.invalidate();
			},
		});
	const batchCreateSalaryIncomeTax =
		api.parameters.batchCreateSalaryIncomeTax.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentSalaryIncomeTax.invalidate();
				ctx.parameters.getAllSalaryIncomeTax.invalidate();
				ctx.parameters.getAllFutureSalaryIncomeTax.invalidate();
			}
		})
	const deleteSalaryIncomeTax =
		api.parameters.deleteSalaryIncomeTax.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentSalaryIncomeTax.invalidate();
				ctx.parameters.getAllSalaryIncomeTax.invalidate();
				ctx.parameters.getAllFutureSalaryIncomeTax.invalidate();
			},
		});
	//#endregion

	// #region <IncomeTaxSetting>
	const getCurrentIncomeTaxSetting = () => api.parameters.getCurrentIncomeTaxSetting.useQuery({ period_id });
	const getFutureIncomeTaxSetting = () => api.parameters.getAllFutureIncomeTaxSetting.useQuery();
	const createIncomeTaxSetting =
		api.parameters.createIncomeTaxSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentIncomeTaxSetting.invalidate();
				ctx.parameters.getAllIncomeTaxSetting.invalidate();
				ctx.parameters.getAllFutureIncomeTaxSetting.invalidate();
			},
		});
	const updateIncomeTaxSetting =
		api.parameters.updateIncomeTaxSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentIncomeTaxSetting.invalidate();
				ctx.parameters.getAllIncomeTaxSetting.invalidate();
				ctx.parameters.getAllFutureIncomeTaxSetting.invalidate();
			},
		});
	const deleteIncomeTaxSetting =
		api.parameters.deleteIncomeTaxSetting.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentIncomeTaxSetting.invalidate();
				ctx.parameters.getAllIncomeTaxSetting.invalidate();
				ctx.parameters.getAllFutureIncomeTaxSetting.invalidate();
			},
		});
	//#endregion

	// #region <AllowanceRange>
	const getCurrentAllowanceRange = () =>
		api.parameters.getCurrentAllowanceRange.useQuery({ period_id });
	const getFutureAllowanceRange = () =>
		api.parameters.getAllFutureAllowanceRange.useQuery();
	const updateAllowanceRange =
		api.parameters.updateAllowanceRange.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAllowanceRange.invalidate();
				ctx.parameters.getAllAllowanceRange.invalidate();
				ctx.parameters.getAllFutureAllowanceRange.invalidate();
			},
		});
	const createAllowanceRange =
		api.parameters.createAllowanceRange.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAllowanceRange.invalidate();
				ctx.parameters.getAllAllowanceRange.invalidate();
				ctx.parameters.getAllFutureAllowanceRange.invalidate();
			},
		});
	const batchCreateAllowanceRange =
		api.parameters.batchCreateAllowanceRange.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAllowanceRange.invalidate();
				ctx.parameters.getAllAllowanceRange.invalidate();
				ctx.parameters.getAllFutureAllowanceRange.invalidate();
			},
		});
	const deleteAllowanceRange =
		api.parameters.deleteAllowanceRange.useMutation({
			onSuccess: () => {
				ctx.parameters.getCurrentAllowanceRange.invalidate();
				ctx.parameters.getAllAllowanceRange.invalidate();
				ctx.parameters.getAllFutureAllowanceRange.invalidate();
			},
		});
	//#endregion

	const functionsDictionary: Record<ParameterTableEnum, FunctionsApi> = {
		TableAttendance: {
			queryCurrentFunction: getCurrentAttendanceSetting,
			queryFutureFunction: getFutureAttendanceSetting,
			updateFunction: updateAttendanceSetting,
			createFunction: createAttendanceSetting,
			deleteFunction: deleteAttendanceSetting,
			batchCreateFunction: undefined,
		},
		TableBankSetting: {
			queryCurrentFunction: getCurrentBankSetting,
			queryFutureFunction: getFutureBankSetting,
			updateFunction: updateBankSetting,
			createFunction: createBankSetting,
			deleteFunction: deleteBankSetting,
			batchCreateFunction: batchCreateBankSetting,
		},
		TableInsurance: {
			queryCurrentFunction: getCurrentInsuranceRateSetting,
			queryFutureFunction: getFutureInsuranceRateSetting,
			updateFunction: updateInsuranceRateSetting,
			createFunction: createInsuranceRateSetting,
			deleteFunction: deleteInsuranceRateSetting,
			batchCreateFunction: undefined,
		},
		TableTrustMoney: {
			queryCurrentFunction: getCurrentTrustMoneySetting,
			queryFutureFunction: getFutureTrustMoneySetting,
			updateFunction: updateTrustMoneySetting,
			createFunction: createTrustMoneySetting,
			deleteFunction: deleteTrustMoneySetting,
			batchCreateFunction: batchCreateTrustMoneySetting,
		},
		TableLevel: {
			queryCurrentFunction: getCurrentLevel,
			queryFutureFunction: getFutureLevel,
			updateFunction: updateLevel,
			createFunction: createLevel,
			deleteFunction: deleteLevel,
			batchCreateFunction: batchCreateLevel,
		},
		TableLevelRange: {
			queryCurrentFunction: getCurrentLevelRange,
			queryFutureFunction: getFutureLevelRange,
			updateFunction: updateLevelRange,
			createFunction: createLevelRange,
			deleteFunction: deleteLevelRange,
			batchCreateFunction: batchCreateLevelRange,
		},
		TableSalaryIncomeTax: {
			queryCurrentFunction: getCurrentSalaryIncomeTax,
			queryFutureFunction: getFutureSalaryIncomeTax,
			updateFunction: updateSalaryIncomeTax,
			createFunction: createSalaryIncomeTax,
			deleteFunction: deleteSalaryIncomeTax,
			batchCreateFunction: batchCreateSalaryIncomeTax,
		},
		TableIncomeTaxSetting: {
			queryCurrentFunction: getCurrentIncomeTaxSetting,
			queryFutureFunction: getFutureIncomeTaxSetting,
			updateFunction: updateIncomeTaxSetting,
			createFunction: createIncomeTaxSetting,
			deleteFunction: deleteIncomeTaxSetting,
			batchCreateFunction: undefined,
		},
		TableAllowanceRange: {
			queryCurrentFunction: getCurrentAllowanceRange,
			queryFutureFunction: getFutureAllowanceRange,
			updateFunction: updateAllowanceRange,
			createFunction: createAllowanceRange,
			deleteFunction: deleteAllowanceRange,
			batchCreateFunction: batchCreateAllowanceRange,
		}
	};

	// Return the provider with the functions
	return (
		<parameterToolbarFunctionsContext.Provider
			value={functionsDictionary[selectedTableType]}
		>
			{children}
		</parameterToolbarFunctionsContext.Provider>
	);
}
