import * as bcrypt from "bcrypt";
import { injectable } from "tsyringe";
import { User } from "../database/entity/SALARY/user";
import { Op } from "sequelize";
import { BaseResponseError } from "../errors/base_response_error";
import { get_date_string, select_value } from "./helper_function";
import { type z } from "zod";
import {
	type createUserService,
	type updateUserService,
} from "../api/types/user_type";
import { Access } from "../database/entity/SALARY/access";

@injectable()
export class UserService {
	async createUser({
		emp_no,
		password,
		role,
		start_date,
		end_date,
	}: z.infer<typeof createUserService>): Promise<User> {
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(password, salt);

		const access = await Access.findOne({
			where: {
				role: role,
				disabled: false,
			},
		});

		if (access == null) {
			throw new BaseResponseError(`Access role=${role} does not exist`);
		}

		const newUser = await User.create({
			emp_no: emp_no,
			hash: hash,
			access_id: access.id,
			start_date: get_date_string(start_date ?? new Date()),
			end_date: end_date ? get_date_string(end_date) : null,
			disabled: false,
			create_by: "system",
			update_by: "system",
		});

		return newUser;
	}

	async getAllUser(): Promise<User[]> {
		const users = await User.findAll({
			where: {
				disabled: false,
			},
			include: "access",
		});
		return users;
	}

	async getUserByEmpNo(emp_no: string): Promise<User | null> {
		const current_date_string = get_date_string(new Date());
		const user = await User.findOne({
			where: {
				emp_no: emp_no,
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
				disabled: false,
			},
			include: Access,
		});
		return user;
	}

	async getCurrentUser(): Promise<User[] | null> {
		const current_date_string = get_date_string(new Date());
		const user = await User.findAll({
			where: {
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
				disabled: false,
			},
		});
		return user;
	}

	async updateUser({
		emp_no,
		password,
		role,
		start_date,
		end_date,
	}: z.infer<typeof updateUserService>): Promise<void> {
		const user = await this.getUserByEmpNo(emp_no!);
		if (user == null) {
			throw new BaseResponseError("User does not exist");
		}

		let hash: string | null = null;

		if (password != null) {
			const salt = await bcrypt.genSalt();
			hash = await bcrypt.hash(password, salt);
		}

		await this.deleteUser(user.id);

		await User.create({
			emp_no: select_value(emp_no, user.emp_no),
			hash: select_value(hash, user.hash)!,
			start_date: select_value(start_date, user.start_date)!,
			end_date: select_value(end_date, user.end_date),
			disabled: false,
			create_by: "system",
			update_by: "system",
		});
	}

	async deleteUser(id: number): Promise<void> {
		const destroyedRows = await User.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
