import { z } from "zod";

export const checkImportResult = z.object({
	empty: z.boolean(),
});
