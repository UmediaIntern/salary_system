export type FunctionMode = "create" | "update" | "delete" | "none";

export type FunctionsItem = {
	creatable: boolean;
	updatable: boolean;
	deletable: boolean;
};

export interface DataWithFunctions {
	functions: FunctionsItem;
}

