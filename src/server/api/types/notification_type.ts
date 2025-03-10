import { z } from "zod";

const notification = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().nullable(),
});


// Create Types
export const createNotification = notification.omit({
    id: true,
});

// Frontend Types
export const notificationFE = notification;
export type NotificationFEType = z.infer<typeof notificationFE>;
