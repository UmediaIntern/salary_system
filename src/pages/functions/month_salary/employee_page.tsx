import React from "react";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import TablesView from "~/pages/employees/tables_view";

interface EmployeePageProps {
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}

export function EmployeePage({
	selectedIndex,
	setSelectedIndex,
}: EmployeePageProps) {

	const { t } = useTranslation(['common'])

	return (
		<>
			<div className="flex h-0 grow flex-col rounded-md border-2">
				<TablesView />
			</div>
			<div className="mt-4 flex justify-between">
				<Button onClick={() => setSelectedIndex(selectedIndex - 1)}>
					{t("button.previous_step")}
				</Button>
				<Button onClick={() => setSelectedIndex(selectedIndex + 1)}>
					{t("button.next_step")}
				</Button>
			</div>
		</>
	);
}
