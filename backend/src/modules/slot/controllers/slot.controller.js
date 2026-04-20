import slotService from "../services/slot.service.js";

class SlotController {
    async generateSlots(req, res, next) {
        try {
            const { salonId, serviceId, date, capacity, startTime, endTime, slotDuration } = req.body;
            const slots = await slotService.generateSlots(req.user.id, salonId, serviceId, date, capacity, startTime, endTime, slotDuration);
            
            res.status(201).json({
                success: true,
                message: "Slots generated successfully",
                count: slots.length,
                data: slots,
            });
        } catch (error) {
            next(error);
        }
    }

    async getSlots(req, res, next) {
        try {
            const slots = await slotService.getSlots(req.query);
            res.status(200).json({
                success: true,
                count: slots.length,
                data: slots,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateSlotStatus(req, res, next) {
        try {
            const { status } = req.body;
            const slot = await slotService.updateSlotStatus(req.params.id, req.user.id, status);
            res.status(200).json({
                success: true,
                message: `Slot marked as ${status}`,
                data: slot,
            });
        } catch (error) {
            next(error);
        }
    }

    // Usually called by Booking Module, but exposing for API completeness
    async reserveSlot(req, res, next) {
        try {
            const slot = await slotService.reserveSlot(req.params.id);
            res.status(200).json({
                success: true,
                message: "Slot reserved for 5 minutes",
                data: slot,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new SlotController();
