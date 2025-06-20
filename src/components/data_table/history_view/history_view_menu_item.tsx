import { ArrowRightCircle, GitCommitHorizontal } from "lucide-react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { formatDate } from "~/lib/utils/format_date";
import { useTranslation } from "react-i18next";
// TODO: maybe don't use this type
import { type Period } from "~/server/database/entity/UMEDIA/period";

interface HistoryViewEntryProp {
	id: number;
	selected: boolean;
	period: Period | null;
	startDate: Date;
	endDate: Date | null;
	updateBy: string;
	onClick: () => void;
}

function is_date_available(
	period: Period | null,
	start_date: Date,
	end_date: Date | null
): boolean {
	if (!period) {
		return false;
	}
	const targetDate = period.end_date;

	if (end_date && end_date < targetDate) {
		return false;
	}
	if (start_date && start_date > targetDate) {
		return false;
	}
	return true;
}

/* e.id === selectedEmpData?.id */
export function HistoryViewMenuItem({
	id,
	selected,
	period,
	startDate,
	endDate,
	updateBy,
	onClick,
}: HistoryViewEntryProp) {
	const { t } = useTranslation(["common"]);

	const isDateAvailable = is_date_available(period, startDate, endDate);

	return (
		<div
			key={id}
			className={cn(
				" relative m-2 flex flex-col rounded-md border p-1 hover:bg-muted",
				selected && "bg-muted",
				isDateAvailable && "mb-3 border-blue-500"
			)}
			onClick={onClick}
		>
			<div className="m-1 flex flex-wrap items-center justify-center">
				<div className="flex-1 whitespace-nowrap text-center">
					{formatDate("day", startDate) ?? t("others.now")}
				</div>
				<ArrowRightCircle size={18} className="mx-2 flex-shrink-0" />
				<div className="flex-1 whitespace-nowrap text-center">
					{formatDate("day", endDate) ?? t("others.now")}
				</div>
			</div>
			{/* Update by */}
			<div className="m-1 flex text-sm">
				<GitCommitHorizontal size={18} className="mr-2 flex-shrink-0" />
				<div className="line-clamp-1 break-all">
					{t("table.update_by") + " " + updateBy}
				</div>
			</div>
			{/* Current badge */}
			{isDateAvailable && (
				<div className="absolute -bottom-3 right-2 z-10">
					<Badge>{t("table.current")}</Badge>
				</div>
			)}
		</div>
	);
}
