import { z } from "zod";

export const functionModeEnum = z.enum(["create", "update", "delete", "none"]);
export type FunctionModeEnumType = z.infer<typeof functionModeEnum>;

export type FunctionsItem = {
    creatable: boolean;
    updatable: boolean;
    deletable: boolean;
};

export interface DataWithFunctions {
    functions: FunctionsItem;
}

