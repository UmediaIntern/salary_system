import { EmptyErrorScope, type ErrorScope } from "./error_scope";

export class BaseResponseError extends Error {
  public statusCode: number;
  public scope: ErrorScope; 

	constructor(msg: string, statusCode = 500, errorScope = EmptyErrorScope) {
		super(msg);
    this.statusCode = statusCode;
    this.scope = errorScope;
    this.name = this.constructor.name;
		Object.setPrototypeOf(this, BaseResponseError.prototype);
	}

	errorMsg() {
		return `(${this.statusCode}) (Error in ${this.scope.name}) ${this.message}`;
	}
}
