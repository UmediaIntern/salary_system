import { type Session } from "next-auth";
import { type User } from "../database/entity/SALARY/user";
import { BaseResponseError } from "../errors/base_response_error";

interface ContextType {
  session: Session | null;
  user: User | null;
}

export function getRoleFromCtx(ctx: ContextType) {
  const role = ctx.session?.user.role ?? null;
  if (role === null) {
    throw new BaseResponseError("Role is null", 400);
  }
  return role;
}
