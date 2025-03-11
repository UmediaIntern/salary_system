import React, { useContext } from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";

import { api } from "~/utils/api";
import { type SyncCheckStatusEnumType } from "~/components/synchronize/utils/sync_check_status";
import { useTranslation } from "react-i18next";
import { EmployeeDataChangeTable } from "./emp_data_change_table";
import { type DataComparison, type SyncInputType } from "~/server/api/types/sync_type";
import { usePeriodContext } from "../context/period_context_provider";

export interface DataComparisonAndStatus extends DataComparison {
	check_status: SyncCheckStatusEnumType;
}

export interface SyncDataAndStatus {
	emp_no: string;
	name: DataComparison<string>;
	english_name: DataComparison<string>;
	department: DataComparison<string>;
	comparisons: Array<DataComparisonAndStatus>;
}

interface UpdateTableDialogProps {
	data: SyncDataAndStatus[];
}

export function UpdateTableDialog({ data }: UpdateTableDialogProps) {
	const { selectedPeriod } = usePeriodContext();
	const { t } = useTranslation(["common"]);

	const ctx = api.useUtils();

	const { mutate } = api.sync.synchronize.useMutation({
		onSuccess: () => {
			void ctx.sync.checkEmployeeData.invalidate();
		},
	});

	function handleUpdate(period_id: number) {
		const update_input: SyncInputType[] = [];

		data.forEach((d) => {
			const change_keys: string[] = []
			for (const c of d.comparisons) {
				if (c.check_status === "checked") {
					change_keys.push(c.key)
				}
			}
			if (change_keys.length > 0) {
				update_input.push({
					emp_no: d.emp_no,
					keys: change_keys
				})
			}
		});

		mutate({
			period: period_id,
			change_emp_list: update_input,
		});
	}

	if (selectedPeriod == null) {
		return <p>{t("others.select_period")}</p>;
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					onClick={() => {
						console.log("Show update table dialog");
					}}
				>
					{t("button.update")}
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[90vw] max-w-6xl p-8">
				<DialogHeader className="mx-4 flex items-center">
					<div className="mr-auto">
						<DialogTitle>{t("others.changed_data")}</DialogTitle>
						<DialogDescription>
							{t("others.changed_data_msg")}
						</DialogDescription>
					</div>
				</DialogHeader>
				<div className="max-h-[70vh]">
					<EmployeeDataChangeTable
						data={data}
						mode="changed"
						setDataStatus={(_, __, ___) => undefined}
					/>
				</div>

				<DialogClose asChild>
					<Button
						type="submit"
						onClick={() => handleUpdate(selectedPeriod.period_id)}
					>
						{t("button.update")}
					</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}

