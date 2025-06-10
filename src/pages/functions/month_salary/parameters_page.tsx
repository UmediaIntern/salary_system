import React from "react";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import TablesView from "~/pages/parameters/tables_view";

interface ParameterPageProps {
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}

export function ParameterPage({
	selectedIndex,
	setSelectedIndex,
}: ParameterPageProps) {

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
