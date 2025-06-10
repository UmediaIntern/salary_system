import { Button } from "~/components/ui/button";
import { EmployeeCandidateTable } from "../tables/employee_candidate_table";
import { useTranslation } from 'next-i18next'

interface EmployeeCandidatePageProps {
	period_id: number;
	func: string;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}

export function EmployeeCandidatePage({
	period_id,
	func,
	selectedIndex,
	setSelectedIndex,
}: EmployeeCandidatePageProps) {
	const { t } = useTranslation(['common'], { keyPrefix: "button" })

	return (
		<>
			<EmployeeCandidateTable period_id={period_id} func={func} />
			<div className="mt-4 flex justify-between">
				<Button onClick={() => setSelectedIndex(selectedIndex - 1)}>
					{t("previous_step")}
				</Button>
				<Button onClick={() => setSelectedIndex(selectedIndex + 1)}>
					{t("next_step")}
				</Button>
			</div>
		</>
	);
}
