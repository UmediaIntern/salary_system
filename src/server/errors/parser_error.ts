import { EmptyErrorScope } from "./error_scope";
import { InternalServerError } from "./internal_server_error";

export class ParserError extends InternalServerError{
	constructor(msg: string, errorScope = EmptyErrorScope) {
		super(`Parser Error: ${msg}`, errorScope);
	}
}

