import React from "react";
import { type Period } from "~/server/database/entity/UMEDIA/period";

const periodContext = React.createContext<{
	selectedPeriod: Period | null;
	setSelectedPeriod: (period: Period) => void;
	selectedPayDate: Date | null;
	setSelectedPayDate: (date: Date) => void;
}>({
	selectedPeriod: null,
	setSelectedPeriod: (_: Period) => undefined,
	selectedPayDate: null,
	setSelectedPayDate: (_: Date) => undefined,
});

export default periodContext;
