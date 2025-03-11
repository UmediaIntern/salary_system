import {
	createContext,
	useState,
	useEffect,
	useContext,
	type PropsWithChildren,
} from "react";
import { type Period } from "~/server/database/entity/UMEDIA/period";
import { SessionStorage } from "~/utils/session_storage";

const periodContext = createContext<{
	selectedPeriod: Period | null;
	setSelectedPeriod: (period: Period) => void;
	selectedPayDate: Date | null;
	setSelectedPayDate: (date: Date) => void;
} | null>(null);

export function PeriodContextProvider({ children }: PropsWithChildren) {
	const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
	const [selectedPayDate, setSelectedPayDate] = useState<Date | null>(null);

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

	return (
		<periodContext.Provider
			value={{
				selectedPeriod,
				setSelectedPeriod,
				selectedPayDate,
				setSelectedPayDate,
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
