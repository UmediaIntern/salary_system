import {
	createContext,
	useState,
	useEffect,
	useContext,
	type PropsWithChildren,
} from "react";
import { type Period } from "~/server/database/entity/UMEDIA/period";
import { SessionStorage } from "~/utils/session_storage";
import { useTranslation } from "react-i18next";

const periodContext = createContext<{
	selectedPeriod: Period | null;
	setSelectedPeriod: (period: Period) => void;
	selectedPayDate: Date | null;
	setSelectedPayDate: (date: Date) => void;
	displayPeriodName: string;
} | null>(null);

export function PeriodContextProvider({ children }: PropsWithChildren) {
	const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
	const [selectedPayDate, setSelectedPayDate] = useState<Date | null>(null);
	const [displayPeriodName, setDisplayPeriodName] = useState<string>("");

	const { t } = useTranslation("common");

	useEffect(() => {
		const sessionPeriod = SessionStorage.getSelectedPeriod();
		const sessionPayDate = SessionStorage.getSelectedPayDate();
		if (sessionPeriod) {
			setSelectedPeriod(sessionPeriod);
		}
		if (sessionPayDate) {
			// Check if the date is valid
			const date = new Date(sessionPayDate);
			if (date.getTime() <= 0) {
				console.log("Period context: Invalid date");
				return;
			}
			setSelectedPayDate(date);
		}
	}, []);

	useEffect(() => {
		const original_name = selectedPeriod?.period_name;
		if (original_name) {
			const [month, year] = original_name.split("-");
			const displayName = `20${year}-${t(
				`month.${month!.toLowerCase()}`
			)}`;

			setDisplayPeriodName(displayName);
		}
	}, [t, selectedPeriod]);

	return (
		<periodContext.Provider
			value={{
				selectedPeriod,
				setSelectedPeriod,
				selectedPayDate,
				setSelectedPayDate,
        displayPeriodName,
			}}
		>
			{children}
		</periodContext.Provider>
	);
}

export function usePeriodContext() {
	const context = useContext(periodContext);
	if (context === null) {
		throw new Error(
			"Period Context must be used within a PeriodContextProvider"
		);
	}
	return context;
}
