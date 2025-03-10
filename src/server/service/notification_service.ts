import { injectable } from "tsyringe";
import { Notification } from "../database/entity/SALARY/notification";
import {
	type createNotification,
	type NotificationFEType,
} from "../api/types/notification_type";
import { type z } from "zod";

@injectable()
export class NotificationService {
	async getNotifications(): Promise<NotificationFEType[]> {
		const notifications = await Notification.findAll();
		return notifications;
	}

	async createNotification(
		notificationInput: z.infer<typeof createNotification>
	): Promise<NotificationFEType> {
		const notification = await Notification.create({
			...notificationInput,
			create_by: "system",
			update_by: "system",
		});
		return notification;
	}
}
