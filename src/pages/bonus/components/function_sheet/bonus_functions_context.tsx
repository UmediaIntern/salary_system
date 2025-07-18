import { createContext, type PropsWithChildren } from "react";
import { api } from "~/utils/api";
import {
	type UseTRPCMutationResult,
	type UseTRPCQueryResult,
} from "@trpc/react-query/shared";
import { type BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { type TableEnum } from "../context/data_table_enum";

interface FunctionsApi {
	queryFunction: (() => UseTRPCQueryResult<any, any>) | undefined;
	updateFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	createFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	batchCreateFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
	deleteFunction: UseTRPCMutationResult<any, any, any, any> | undefined;
}

export const bonusToolbarFunctionsContext = createContext<FunctionsApi>({
	queryFunction: undefined,
	updateFunction: undefined,
	createFunction: undefined,
	batchCreateFunction: undefined,
	deleteFunction: undefined,
});

interface ToolbarFunctionsProviderProps {
	selectedTableType: TableEnum;
	period_id: number;
	bonus_type: BonusTypeEnumType;
}

export default function BonusToolbarFunctionsProvider({
	children,
	selectedTableType,
	period_id,
	bonus_type,
}: PropsWithChildren<ToolbarFunctionsProviderProps>) {
	const ctx = api.useUtils();

	// #region <BonusAll>
	const getBonusAll = () =>
		api.bonus.getBonusAll.useQuery({ period_id, bonus_type });
	const updateBonusAll = api.bonus.updateBonusAll.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusAll.invalidate();
		},
	});
	const createBonusAll = api.bonus.createBonusAll.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusAll.invalidate();
		},
	});
	const deleteBonusAll = api.bonus.deleteBonusAll.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusAll.invalidate();
		},
	});

	//#region <BonusWorkType>
	const getBonusWorkType = () =>
		api.bonus.getBonusWorkType.useQuery({ period_id, bonus_type });
	const updateBonusWorkType = api.bonus.updateBonusWorkType.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusWorkType.invalidate();
		},
	});
	const createBonusWorkType = api.bonus.createBonusWorkType.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusWorkType.invalidate();
		},
	});
	const batchCreateBonusWorkType =
		api.bonus.batchCreateBonusWorkType.useMutation({
			onSuccess: () => {
				void ctx.bonus.getBonusWorkType.invalidate();
			},
		});
	const deleteBonusWorkType = api.bonus.deleteBonusWorkType.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusWorkType.invalidate();
		},
	});
	//#endregion

	//#region <BonusDepartment>
	const getBonusDepartment = () =>
		api.bonus.getBonusDepartment.useQuery({ period_id, bonus_type });
	const updateBonusDepartment = api.bonus.updateBonusDepartment.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusDepartment.invalidate();
		},
	});
	const createBonusDepartment = api.bonus.createBonusDepartment.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusDepartment.invalidate();
		},
	});
	const batchCreateBonusDepartment =
		api.bonus.batchCreateBonusDepartment.useMutation({
			onSuccess: () => {
				void ctx.bonus.getBonusDepartment.invalidate();
			},
		});
	const deleteBonusDepartment = api.bonus.deleteBonusDepartment.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusDepartment.invalidate();
		},
	});
	//#endregion

	//#region <BonusPosition>
	const getBonusPosition = () =>
		api.bonus.getBonusPosition.useQuery({ period_id, bonus_type });
	const updateBonusPosition = api.bonus.updateBonusPosition.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusPosition.invalidate();
		},
	});
	const createBonusPosition = api.bonus.createBonusPosition.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusPosition.invalidate();
		},
	});
	const batchCreateBonusPosition =
		api.bonus.batchCreateBonusPosition.useMutation({
			onSuccess: () => {
				void ctx.bonus.getBonusPosition.invalidate();
			},
		});
	const deleteBonusPosition = api.bonus.deleteBonusPosition.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusPosition.invalidate();
		},
	});
	//#endregion

	//#region <BonusSeniority>
	const getBonusSeniority = () =>
		api.bonus.getBonusSeniority.useQuery({ period_id, bonus_type });
	const updateBonusSeniority = api.bonus.updateBonusSeniority.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusSeniority.invalidate();
		},
	});
	const createBonusSeniority = api.bonus.createBonusSeniority.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusSeniority.invalidate();
		},
	});
	const batchCreateBonusSeniority =
		api.bonus.batchCreateBonusSeniority.useMutation({
			onSuccess: () => {
				void ctx.bonus.getBonusSeniority.invalidate();
			},
		});
	const deleteBonusSeniority = api.bonus.deleteBonusSeniority.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusSeniority.invalidate();
		},
	});
	//#endregion

	//#region <EmployeeBonus>
	const getEmployeeBonus = () =>
		api.bonus.getEmployeeBonus.useQuery({ period_id, bonus_type });
	const updateEmployeeBonus = api.bonus.updateEmployeeBonus.useMutation({
		onSuccess: () => {
			void ctx.bonus.getEmployeeBonus.invalidate();
		},
	});
	const createEmployeeBonus = api.bonus.createEmployeeBonus.useMutation({
		onSuccess: () => {
			void ctx.bonus.getEmployeeBonus.invalidate();
		},
	});
	const deleteEmployeeBonus = api.bonus.deleteEmployeeBonus.useMutation({
		onSuccess: () => {
			void ctx.bonus.getEmployeeBonus.invalidate();
		},
	});
	//#endregion

	const functionsDictionary: Record<TableEnum, FunctionsApi> = {
		TableBonusAll: {
			queryFunction: getBonusAll,
			updateFunction: updateBonusAll,
			createFunction: createBonusAll,
			batchCreateFunction: undefined,
			deleteFunction: deleteBonusAll,
		},
		TableBonusWorkType: {
			queryFunction: getBonusWorkType,
			updateFunction: updateBonusWorkType,
			createFunction: createBonusWorkType,
			batchCreateFunction: batchCreateBonusWorkType,
			deleteFunction: deleteBonusWorkType,
		},
		TableBonusDepartment: {
			queryFunction: getBonusDepartment,
			updateFunction: updateBonusDepartment,
			createFunction: createBonusDepartment,
			batchCreateFunction: batchCreateBonusDepartment,
			deleteFunction: deleteBonusDepartment,
		},
		TableBonusPosition: {
			queryFunction: getBonusPosition,
			updateFunction: updateBonusPosition,
			createFunction: createBonusPosition,
			batchCreateFunction: batchCreateBonusPosition,
			deleteFunction: deleteBonusPosition,
		},
		TableBonusSeniority: {
			queryFunction: getBonusSeniority,
			updateFunction: updateBonusSeniority,
			createFunction: createBonusSeniority,
			batchCreateFunction: batchCreateBonusSeniority,
			deleteFunction: deleteBonusSeniority,
		},
		TableEmployeeBonus: {
			queryFunction: getEmployeeBonus,
			updateFunction: updateEmployeeBonus,
			createFunction: createEmployeeBonus,
			batchCreateFunction: undefined,
			deleteFunction: deleteEmployeeBonus,
		},
	};

	// Return the provider with the functions
	return (
		<bonusToolbarFunctionsContext.Provider
			value={functionsDictionary[selectedTableType]}
		>
			{children}
		</bonusToolbarFunctionsContext.Provider>
	);
}
