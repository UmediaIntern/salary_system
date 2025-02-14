import { BaseResponseError } from "./base_response_error";
import { EmptyErrorScope } from "./error_scope";

export class InternalServerError extends BaseResponseError {
	constructor(msg: string, errorScope = EmptyErrorScope) {
		super(`[Internal Server Error] ${msg}`, 500, errorScope);
	}
}
