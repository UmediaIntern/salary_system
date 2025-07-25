import { useState } from "react";
import { api } from "~/utils/api";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { SessionStorage } from "~/utils/session_storage";
import { Button } from "./ui/button";
import {
	DialogContent,
	DialogClose,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { type Period } from "~/server/database/entity/UMEDIA/period";
import { useTranslation } from "react-i18next";
import { usePeriodContext } from "./context/period_context_provider";
import { useQueryHandle } from "./query_boundary/query_handle";
import { formatDate } from "~/lib/utils/format_date";

export function PeriodSelector() {
	const { t } = useTranslation("common");

	const getPeriod = api.function.getPeriod.useQuery();
	const {
		selectedPeriod,
		setSelectedPeriod,
		selectedPayDate,
		setSelectedPayDate,
	} = usePeriodContext();

	const [tmpPeriod, setTmpPeriod] = useState<Period | null>(
		selectedPeriod ?? null
	);
	const [tmpPayDate, setTmpPayDate] = useState<Date | null>(
		selectedPayDate ? new Date(selectedPayDate) : null
	);

	const { data, isPending, content } = useQueryHandle(getPeriod);

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{t("others.period")}</DialogTitle>
				<DialogDescription>
					{t("others.select_period")}
				</DialogDescription>
			</DialogHeader>
			{isPending ? (
				content
			) : (
				<>
					<div className="flex flex-col items-center">
						<div className="flex w-full p-2">
							<div className="flex-1">{t("others.period")}</div>
							<div className="flex-1">
								<Select
									defaultValue={selectedPeriod?.period_name}
									onValueChange={(chosen) => {
										const targetPeriod = data.find(
											(item) =>
												item.period_name === chosen
										)!;
										setTmpPeriod(targetPeriod);
										setTmpPayDate(new Date(targetPeriod.issue_date));
									}}
								>
									<SelectTrigger className="w-full font-mono">
										<SelectValue
											placeholder={t(
												"others.select_period"
											)}
										/>
									</SelectTrigger>
									<SelectContent className="h-[20em]">
										<SelectGroup>
											<SelectLabel>
												{t("others.period")}
											</SelectLabel>
											{data.map((period_info) => {
												const original_name =
													period_info.period_name;
												const [month, year] =
													original_name.split("-");
												return (
													<SelectItem
														key={original_name}
														value={original_name}
														className="font-mono hover:cursor-pointer hover:bg-gray-100"
													>
														{`20${year}-${t(
															`month.${month!.toLowerCase()}`
														)}`}
													</SelectItem>
												);
											})}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex w-full p-2">
							<div className="flex-1">
								{t("table.issue_date")}
							</div>
							<div className="flex-1">
								{formatDate("day", tmpPayDate)}
							</div>
						</div>
					</div>
					<DialogClose asChild>
						<Button
							onClick={() => {
								if (tmpPeriod != null) {
									setSelectedPeriod(tmpPeriod);
									SessionStorage.setSelectedPeriod(tmpPeriod);
								}
								if (tmpPayDate != null) {
									setSelectedPayDate(tmpPayDate);
									SessionStorage.setSelectedPayDate(
										tmpPayDate
									);
								}
							}}
						>
							{t("button.save")}
						</Button>
					</DialogClose>
				</>
			)}
		</DialogContent>
	);
}
