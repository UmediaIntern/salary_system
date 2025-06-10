import { z } from "zod";
import { CryptoHelper } from "~/lib/utils/crypto";

export const stringToEnum = z
	.string()
	.transform((value) => value.replace(/[\r\n]+$/, "")); // Trim \r\n

// Directly return ISO string
export const dateToISOString = z
	.date()
	.transform((value) => value.toISOString());

// Adjust for the timezone, return YYYY-MM-DD
function get_date_string(date: Date): string {
	const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
	const localISOTime = new Date(date.getTime() - tzoffset)
		.toISOString()
		.slice(0, -1);
	return localISOTime.split("T")[0]!;
}

// Date and String conversion
// TODO: change to objects?
export const dateToString = z
	.date()
	.transform((value) => get_date_string(value));

export const dateToStringNullable = z
	.date()
	.nullable()
	.transform((value) => (value ? get_date_string(value) : null));

export const stringToDate = z.string().pipe(z.coerce.date());

export const stringToDateNullable = z
	.string()
	.nullable()
	.transform((value) => (value === null ? null : new Date(value)))
	.pipe(z.date().nullable());

// export function d2s(date: Date) {
//   return dateToString.parse(date);
// }

export const encodeString = z.coerce
	.string()
	.transform((value) => CryptoHelper.encrypt(value));

export const encodeStringNullable = z.coerce
	.string()
	.nullable()
	.transform((value) => (value ? CryptoHelper.encrypt(value) : null));

export const decodeStringToString = z
	.string()
	.transform((value) => CryptoHelper.decrypt(value));

export const decodeStringToStringNullable = z
	.string()
	.nullable()
	.transform((value) => value ? CryptoHelper.decrypt(value) : null);

export const decodeStringToNumber = z
	.string()
	.transform((value) => CryptoHelper.decrypt(value))
	.pipe(z.coerce.number());

export const decodeStringToNumberNullable = z
	.string()
	.nullable()
	.transform((value) => (value ? CryptoHelper.decrypt(value) : null))
	.pipe(z.coerce.number().nullable());

export const optionalNumDefaultZero = z.number().optional().default(0);
