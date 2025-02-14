export class BaseResponseError extends Error {
	constructor(msg: string) {
		super(msg);
		Object.setPrototypeOf(this, BaseResponseError.prototype);
	}

	errorMsg() {
		return this.message;
	}
}
