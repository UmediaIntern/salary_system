import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../../errors/base_response_error";
import { z } from "zod";
import { ReportService } from "~/server/service/report_service";
import { PayTypeEnum } from "../types/pay_type_enum";
import { roundProperties } from "~/server/database/mapper/helper_function";

export const reportRouter = createTRPCRouter({
    getTransactionIndividual: publicProcedure
        .input(z.object({ period_id: z.number(), pay_type: PayTypeEnum }))
        .query(async ({ input }) => {
            const reportService = container.resolve(ReportService);
            const transactions = await reportService.getTransactionIndividual(
                input.period_id,
                input.pay_type
            );
            if (transactions == null) {
                throw new BaseResponseError("Transactions does not exist");
            }
            return [{ name: "transactions", data: transactions.map(e => roundProperties(e, 2)) }];
        }),

    getTransactionDepartment: publicProcedure
        .input(z.object({ period_id: z.number(), pay_type: PayTypeEnum }))
        .query(async ({ input }) => {
            const reportService = container.resolve(ReportService);
            const transactions = await reportService.getTransactionDepartment(
                input.period_id,
                input.pay_type
            );
            if (transactions == null) {
                throw new BaseResponseError("Transactions does not exist");
            }
            return [{ name: "transactions", data: transactions.map(e => roundProperties(e, 2)) }];
        }),

    getSalaryOut: publicProcedure
        .input(z.object({ period_id: z.number(), pay_type: PayTypeEnum }))
        .query(async ({ input }) => {
            const reportService = container.resolve(ReportService);
            const salaryOut = await reportService.getSalaryOut(
                input.period_id,
                input.pay_type
            );
            if (salaryOut == null) {
                throw new BaseResponseError("Transactions does not exist");
            }
            return [{ name: "salaryOut", data: salaryOut.map(e => roundProperties(e, 2)) }];
        }),

    getHILevelRange: publicProcedure
        .input(z.object({ period_id: z.number(), pay_type: PayTypeEnum }))
        .query(async ({ input }) => {
            const reportService = container.resolve(ReportService);
            const HILevelRange = await reportService.getHILevelRange(
                input.period_id,
                input.pay_type
            );
            if (HILevelRange == null) {
                throw new BaseResponseError("Transactions does not exist");
            }
            return [{ name: "HILevelRange", data: HILevelRange.map(e => roundProperties(e, 2)) }];
        }),
    getLILevelRange: publicProcedure
        .input(z.object({ period_id: z.number(), pay_type: PayTypeEnum }))
        .query(async ({ input }) => {
            const reportService = container.resolve(ReportService);
            const LILevelRange = await reportService.getLILevelRange(
                input.period_id,
                input.pay_type
            );
            if (LILevelRange == null) {
                throw new BaseResponseError("Transactions does not exist");
            }
            return [{ name: "LILevelRange", data: LILevelRange.map(e => roundProperties(e, 2)) }];
        }),
    getLRLevelRange: publicProcedure
        .input(z.object({ period_id: z.number(), pay_type: PayTypeEnum }))
        .query(async ({ input }) => {
            const reportService = container.resolve(ReportService);
            const LRLevelRange = await reportService.getLRLevelRange(
                input.period_id,
                input.pay_type
            );
            if (LRLevelRange == null) {
                throw new BaseResponseError("Transactions does not exist");
            }
            return [{ name: "LRLevelRange", data: LRLevelRange.map(e => roundProperties(e, 2)) }];
        }),
    getHIDetailsOut: publicProcedure
        .input(z.object({ period_id: z.number(), pay_type: PayTypeEnum }))
        .query(async ({ input }) => {
            const reportService = container.resolve(ReportService);
            const HIDetailsOut = await reportService.getHIDetailsOut(
                input.period_id,
                input.pay_type
            );
            if (HIDetailsOut == null) {
                throw new BaseResponseError("Transactions does not exist");
            }
            return [{ name: "HIDetailsOut", data: HIDetailsOut.map(e => roundProperties(e, 2)) }];
        }),
    getOIInsurance: publicProcedure
        .input(z.object({ period_id: z.number(), pay_type: PayTypeEnum }))
        .query(async ({ input }) => {
            const reportService = container.resolve(ReportService);
            const OIInsurance = await reportService.getOccupationalInjuryInsurance(
                input.period_id,
                input.pay_type
            );
            if (OIInsurance == null) {
                throw new BaseResponseError("Transactions does not exist");
            }
            return [{ name: "OIInsurance", data: OIInsurance.map(e => roundProperties(e, 2)) }];
        }),
    getTotal: publicProcedure
        .input(z.object({ period_id: z.number(), pay_type: PayTypeEnum }))
        .query(async ({ input }) => {
            const reportService = container.resolve(ReportService);
            const total = await reportService.getTotal(
                input.period_id,
                input.pay_type
            );
            if (total == null) {
                throw new BaseResponseError("Transactions does not exist");
            }
            return [{ name: "work_type", data: total.map(e => roundProperties(e, 2)) }];
        }),
    getDepartmentTotal: publicProcedure
        .input(z.object({ period_id: z.number(), pay_type: PayTypeEnum }))
        .query(async ({ input }) => {
            const reportService = container.resolve(ReportService);
            const department_total = await reportService.getDepartmentTotal(
                input.period_id,
                input.pay_type
            );
            if (department_total == null) {
                throw new BaseResponseError("Transactions does not exist");
            }
            return [{ name: "department+work_type", data: department_total.map(e => roundProperties(e, 2)) }];
        })
});
