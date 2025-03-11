import { Period } from "~/server/database/entity/UMEDIA/period";

export class SessionStorage {
	static getSelectedPayDate(): string | null {
		return sessionStorage.getItem("selectedPayDate");
	}

	static setSelectedPayDate(date: Date) {
		sessionStorage.setItem("selectedPayDate", date.toString());
	}

	static getSelectedPeriod(): Period | null {
		const period = sessionStorage.getItem("selectedPeriod");
		if (!period) {
			return null;
		}
		return JSON.parse(period) as Period;
	}

	static setSelectedPeriod(period: Period) {
		sessionStorage.setItem("selectedPeriod", JSON.stringify(period));
	}
}
