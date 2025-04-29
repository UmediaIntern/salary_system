import { z } from "zod";

export const Id = z.object({
	id: z.number(),
});
export const func = z.object({
	functions: z.object({
		creatable: z.boolean(),
		updatable: z.boolean(),
		deletable: z.boolean(),
	}),
})

export const dateFE = z.object({
	start_date: z.date(),
	end_date: z.date().nullable(),
});

export const dateCreate = z.object({
	start_date: z.date().nullable(),
	end_date: z.date().nullable(),
});

export const metadata = z.object({
	create_by: z.string(),
	create_date: z.date(),
	update_by: z.string(),
	update_date: z.date(),
});

export const dateAll = dateCreate.merge(metadata);
export const dateMetaFE = dateFE.merge(metadata);

export const empData = z.object({
	emp_name: z.string(),
	department: z.string(),
	position: z.number(),
	position_type: z.string(),
});

