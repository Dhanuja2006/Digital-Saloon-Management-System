import Notification from "../models/Notification.js";

class NotificationController {
    async getNotifications(req, res) {
        try {
            const notifications = await Notification.find({ userId: req.user.id }).sort("-createdAt");
            res.status(200).json({ success: true, data: notifications });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async markAsRead(req, res) {
        try {
            await Notification.findByIdAndUpdate(req.params.id, { status: "read" });
            res.status(200).json({ success: true, message: "Marked as read" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async markAllAsRead(req, res) {
        try {
            await Notification.updateMany({ userId: req.user.id }, { status: "read" });
            res.status(200).json({ success: true, message: "All marked as read" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new NotificationController();
