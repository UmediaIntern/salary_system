import { useContext, useState } from "react";
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
import periodContext from "./context/period_context";
import { Input } from "./ui/input";
import { SessionStorage } from "~/utils/session_storage";
import { Button } from "./ui/button";
import { DialogClose } from "./ui/dialog";
import { type Period } from "~/server/database/entity/UMEDIA/period";
import { useTranslation } from "react-i18next";

export default function PeriodSelector() {
	const { t } = useTranslation('common')

	const getPeriod = api.function.getPeriod.useQuery();
	const {
		selectedPeriod,
		setSelectedPeriod,
		selectedPayDate,
		setSelectedPayDate,
	} = useContext(periodContext);

	const [tmpPeriod, setTmpPeriod] = useState<Period | null>(
		selectedPeriod ?? null
	);
	const [tmpPayDate, setTmpPayDate] = useState<string | null>(
		selectedPayDate ?? null
	);

	if (getPeriod.isLoading) {
		return <></>;
	}

	return (
		<div className="flex flex-col items-center">
			{getPeriod.isFetched ? (
				<>
					<div className="flex w-full p-2">
						<div className="flex-1">{t("others.period")}</div>
						<div className="flex-1">
							<Select
								defaultValue={selectedPeriod?.period_name}
								onValueChange={(chosen) => {
									const targetPeriod = getPeriod.data!.find(
										(item) => item.period_name === chosen
									)!;
									setTmpPeriod(targetPeriod);
									// setSelectedPeriod(targetPeriod);
									// SessionStorage.setSelectedPeriod(
									//	targetPeriod
									// );
								}}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder={t("others.select_period")} />
								</SelectTrigger>
								<SelectContent className="h-[20em]">
									<SelectGroup>
										<SelectLabel>{t('others.period')}</SelectLabel>
										{getPeriod.data!.map((period_info) => {
											const original_name = period_info.period_name
											return (
												<SelectItem
													key={
														original_name
													}
													value={
														original_name
													}
												>
													{`20${original_name.split("-")[1]}-${t(`month.${original_name.split("-")[0]!.toLowerCase()}`)}`}
												</SelectItem>
											);
										})}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="flex w-full p-2">
						<div className="flex-1">{t("table.issue_date")}</div>
						<div className="flex-1">
							<Input
								type="Date"
								defaultValue={selectedPayDate ?? undefined}
								onChange={(e) => {
									// setSelectedPayDate(e.target.value);
									// SessionStorage.setSelectedPayDate(
									//	e.target.value
									// );
									setTmpPayDate(e.target.value);
								}}
							></Input>
						</div>
					</div>
					<DialogClose>
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
			) : (
				<></>
			)}
		</div>
	);
}
