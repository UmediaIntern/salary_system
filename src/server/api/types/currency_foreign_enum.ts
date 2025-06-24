import { z } from "zod";

export const currencyForeignEnum = z.enum(["RMB", "USD", "JPY"]);

export type CurrencyForeignEnumType = z.infer<typeof currencyForeignEnum>;
export function currencyForeignLabel(
	currency_foreign: CurrencyForeignEnumType
): string {
	switch (currency_foreign) {
		case "RMB":
			return "人民幣";
		case "USD":
			return "美元";
		case "JPY":
			return "日元";
	}
}
