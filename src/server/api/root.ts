import { parametersRouter } from "~/server/api/routers/parameters";
import { createTRPCRouter } from "~/server/api/trpc";
import { loginRouter } from "./routers/login";
import { debugRouter } from "./routers/debug";
import { syncRouter } from "./routers/sync";
import { accessRouter } from "./routers/access";
import { functionRouter } from "./routers/function";
import { employeeDataRouter } from "./routers/employee_data";
import { employeePaymentRouter } from "./routers/employee_payment";
import { employeeTrustRouter } from "./routers/employee_trust";
import { calculateRouter } from "./routers/calculate";
import { transactionRouter } from "./routers/transaction";
import { bonusRouter } from "./routers/bonus";
import { incomeTaxSettingRouter } from "./routers/income_tax_setting";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	debug: debugRouter,
	parameters: parametersRouter,
	bonus: bonusRouter,
	login: loginRouter,
	access: accessRouter,
	function: functionRouter,
	employeeData: employeeDataRouter,
	employeePayment: employeePaymentRouter,
	employeeTrust: employeeTrustRouter,
	sync: syncRouter,
	calculate: calculateRouter,
	transaction: transactionRouter,

	incomeTaxSetting: incomeTaxSettingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

import ('src/server/database/create_table')
