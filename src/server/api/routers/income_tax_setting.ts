import { z } from "zod";
import { container } from "tsyringe";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { IncomeTaxSettingService } from "~/server/service/income_tax_setting_service";
import { roundProperties } from "~/server/database/mapper/helper_function";
import { createIncomeTaxSettingAPI, updateIncomeTaxSettingAPI } from "../types/income_tax_setting_type";


export const incomeTaxSettingRouter = createTRPCRouter({
    getCurrentIncomeTaxSetting: publicProcedure
        .input(z.object({ period_id: z.number() }))
        .query(async ({ input }) => {
            const incomeTaxService = container.resolve(
                IncomeTaxSettingService
            );
            const incomeTaxSetting =
                await incomeTaxService.getCurrentIncomeTaxSetting(
                    input.period_id
                );
            if (incomeTaxSetting == null) {
                // throw new BaseResponseError(
                // 	"InsuranceRateSetting does not exist"
                // );
                return null;
            }
            const incomeTaxSettingFE = {
                ...roundProperties(incomeTaxSetting, 4),
                start_date: new Date(incomeTaxSetting.start_date),
                end_date: incomeTaxSetting.end_date ? new Date(incomeTaxSetting.end_date) : null,
                functions: {
                    creatable: true,
                    updatable: new Date(incomeTaxSetting.start_date) > new Date(),
                    deletable: new Date(incomeTaxSetting.start_date) > new Date(),
                },
            };
            return incomeTaxSettingFE;
        }),

    createIncomeTaxSetting: publicProcedure
        .input(createIncomeTaxSettingAPI)
        .mutation(async ({ input }) => {
            const incomeTaxService = container.resolve(
                IncomeTaxSettingService
            );
            const newdata =
                await incomeTaxService.createIncomeTaxSetting({
                    ...input,
                    end_date: null,
                });
            await incomeTaxService.rescheduleIncomeTaxSetting();
            return newdata;
        }),

    updateIncomeTaxSetting: publicProcedure
        .input(updateIncomeTaxSettingAPI)
        .mutation(async ({ input }) => {
            const incomeTaxSettingService = container.resolve(
                IncomeTaxSettingService
            );
            await incomeTaxSettingService.updateIncomeTaxSetting(input);
            await incomeTaxSettingService.rescheduleIncomeTaxSetting();
        }),

    deleteIncomeTaxSetting: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
            const incomeTaxSettingService = container.resolve(
                IncomeTaxSettingService
            );
            await incomeTaxSettingService.deleteIncomeTaxSetting(input.id);
            await incomeTaxSettingService.rescheduleIncomeTaxSetting();
        }),
});
