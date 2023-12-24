import * as z from "zod";
import { Translate } from "~/pages/develop_parameters/utils/translation";
import { createSchema } from "./createSchema";
import attendanceConfig from "./attendance.json"
import bankConfig from "./bank.json"

function getTranslate(key: string) {
	return Translate(key) ?? "Not found"
}

function getRequiredError(key: string) {
	return {required_error: getTranslate(key) + " is required."}
}

function getInvalidNumberError(key: string) {
	return {invalid_type_error: getTranslate(key) + " must be a number.",};
}

export const attendanceSchema = (mode?: string) => {
	return createSchema(attendanceConfig, mode);
}

export const bankSchema = (mode?: string) => {
	return createSchema(bankConfig, mode);
}