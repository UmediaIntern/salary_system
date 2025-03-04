import { type ZodTypeDef, type ZodType, type z, type ZodTypeAny } from "zod";
import { deleteProperties } from "./helper_function";
import { type Model, type CreationAttributes } from "sequelize";

export class BaseMapper<
	EncOutput_DB extends Model,
	DecOutput extends object,
	EncInput extends ZodTypeAny,
	DecInput extends ZodTypeAny
> {
	constructor(
		private name: string,
		private encoder: ZodType<
			CreationAttributes<EncOutput_DB>,
			ZodTypeDef,
			z.input<EncInput>
		>,
		private decoder: ZodType<DecOutput, ZodTypeDef, z.input<DecInput>>,
		private deleteProperties: string[] = []
	) {}

	async encode(
		data: z.input<EncInput>
	): Promise<CreationAttributes<EncOutput_DB>> {
		const encoded_result = this.encoder.safeParse(data);

		if (!encoded_result.success) {
			throw new Error(
				`Parse failed in Mapper: ${this.name}, encode Error: ${encoded_result.error.message}, data: ${data}`
			);
		}

		return encoded_result.data;
	}

	async decode(data: z.input<DecInput> | null): Promise<DecOutput> {
		if (!data) {
			throw new Error(`Decoding null data in Mapper: ${this.name}`);
		}

		const decoded_result = this.decoder.safeParse(data);

		if (!decoded_result.success) {
			throw new Error(
				`Parse failed in Mapper: ${this.name}, decode Error: ${decoded_result.error.message}, data: ${data}`
			);
		}

		return deleteProperties(decoded_result.data, this.deleteProperties);
	}

	async decodeList(dataList: z.input<DecInput>[]): Promise<DecOutput[]> {
		try {
			const decoded = await Promise.all(
				dataList.map(async (e) => this.decode(e))
			);
			return decoded;
		} catch (err) {
			if (err instanceof Error) {
				throw new Error(
					`Parse failed in Mapper: ${this.name}, decodeList Error: ${err.message}`
				);
			}
			throw new Error(
				`Parse failed in Mapper: ${this.name}, decodeList Error`
			);
		}
	}
}
