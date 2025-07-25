import { zPeriod, type Period } from "~/server/database/entity/UMEDIA/period";

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
		return zPeriod.parse(JSON.parse(period));
	}

	static setSelectedPeriod(period: Period) {
		sessionStorage.setItem("selectedPeriod", JSON.stringify(period));
	}
}
