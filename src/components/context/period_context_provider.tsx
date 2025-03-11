import React, { useState, type PropsWithChildren, useEffect, useContext } from "react";
import { type Period } from "~/server/database/entity/UMEDIA/period";
import periodContext from "./period_context";
import { SessionStorage } from "~/utils/session_storage";

export default function PeriodContextProvider({ children }: PropsWithChildren) {
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

