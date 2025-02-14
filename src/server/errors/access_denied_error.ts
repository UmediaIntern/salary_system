import { BaseResponseError } from "./base_response_error";

export class AccessDeniedResponseError extends BaseResponseError {
	constructor(msg: string) {
		super(`Access denied ${msg}`, 403);
	}
}
