import { container } from "tsyringe";
import { createTRPCRouter, userProcedure } from "~/server/api/trpc";
import { NotificationService } from "~/server/service/notification_service";
import { notificationFE, createNotification } from "../types/notification_type";

export const notificationRouter = createTRPCRouter({
	getNotifications: userProcedure
		.output(notificationFE.array())
		.query(async () => {
			const notificationService = container.resolve(NotificationService);
			return await notificationService.getNotifications();
		}),

    createNotification: userProcedure
        .input(createNotification)
		.output(notificationFE)
		.query(async ({ input }) => {
			const notificationService = container.resolve(NotificationService);
			return notificationService.createNotification(input);
		}),
});
