import slotRepository from "../repositories/slot.repository.js";
import salonRepository from "../../salon/repositories/salon.repository.js";
import serviceRepository from "../../service/repositories/service.repository.js";

class SlotService {
    async checkSalonOwnership(salonId, ownerId) {
        const salon = await salonRepository.findById(salonId);
        if (!salon) {
            throw { status: 404, message: "Salon not found" };
        }
        if (salon.ownerId._id.toString() !== ownerId.toString()) {
            throw { status: 403, message: "Not authorized to manage slots for this salon" };
        }
        return salon;
    }

    _getDayOfWeek(dateString) {
        const date = new Date(dateString);
        // Using getUTCDay to ensure consistency regardless of the server's local timezone
        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        return days[date.getUTCDay()];
    }

    _timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
    }

    _minutesToTime(minutesStr) {
        const hours = Math.floor(minutesStr / 60);
        const minutes = minutesStr % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    async generateSlots(ownerId, salonId, serviceId, date, capacity = 1, customStart, customEnd, customDuration) {
        // 1. Normalize Date (Ensure comparison and storage always happen at 00:00:00 UTC)
        const normalizedDate = new Date(date);
        normalizedDate.setUTCHours(0, 0, 0, 0);

        const salon = await this.checkSalonOwnership(salonId, ownerId);
        const service = await serviceRepository.findById(serviceId);

        if (!service || service.salonId.toString() !== salonId) {
            throw { status: 404, message: "Service not found or does not belong to this salon" };
        }

        const dayOfWeek = this._getDayOfWeek(date);
        let workingHours = salon.workingHours[dayOfWeek];

        // Fallback: If no working hours are defined, default to 09:00 - 18:00
        if (!workingHours || !workingHours.open || !workingHours.close) {
            workingHours = { open: "09:00", close: "18:00" };
        }

        // 2. Resolve parameters (Use custom overrides or fall back to defaults)
        const startMins = customStart ? this._timeToMinutes(customStart) : this._timeToMinutes(workingHours.open);
        const endLimitMins = customEnd ? this._timeToMinutes(customEnd) : this._timeToMinutes(workingHours.close);
        const duration = customDuration ? parseInt(customDuration) : service.duration;

        // Validation: Ensure custom times are within Salon's working hours
        if (customStart && startMins < this._timeToMinutes(workingHours.open)) {
            throw { status: 400, message: `Start time ${customStart} is before salon opening hours (${workingHours.open})` };
        }
        if (customEnd && endLimitMins > this._timeToMinutes(workingHours.close)) {
            throw { status: 400, message: `End time ${customEnd} is after salon closing hours (${workingHours.close})` };
        }

        // 3. Prevent Duplicates & Cleanup
        // We find any slots between the start and end of the normalized date
        const startOfDay = new Date(normalizedDate);
        const endOfDay = new Date(normalizedDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const existingSlots = await slotRepository.findAll({ 
            salonId, 
            serviceId, 
            date: { $gte: startOfDay, $lte: endOfDay } 
        });

        if (existingSlots.length > 0) {
            // Option: We can either throw an error or clear them. 
            // Letting you know so you can decide, but for now I will strictly block to prevent the 'count increasing' issue.
            throw { status: 400, message: `Slots already exist for this date. (Found ${existingSlots.length} slots)` };
        }

        const generatedSlots = [];
        let currentMins = startMins;

        while (currentMins + duration <= endLimitMins) {
            const startTime = this._minutesToTime(currentMins);
            const endTime = this._minutesToTime(currentMins + duration);

            generatedSlots.push({
                salonId,
                serviceId,
                date: normalizedDate,
                startTime,
                endTime,
                capacity,
            });

            currentMins += duration;
        }

        if (generatedSlots.length === 0) {
            throw { status: 400, message: "Could not generate any slots with the given parameters and working hours" };
        }

        return await slotRepository.createMany(generatedSlots);
    }

    async getSlots(filters) {
        const query = { isActive: true };

        if (filters.salonId) query.salonId = filters.salonId;
        if (filters.serviceId) query.serviceId = filters.serviceId;
        if (filters.date) query.date = new Date(filters.date);
        if (filters.status) query.status = filters.status;

        // Clean up expired locks automatically before returning results
        const now = new Date();
        await slotRepository.update(
            { status: "reserved", lockExpiresAt: { $lt: now } },
            { $set: { status: "available", lockExpiresAt: null } }
        );

        return await slotRepository.findAll(query);
    }

    async updateSlotStatus(id, ownerId, status) {
        const slot = await slotRepository.findById(id);
        if (!slot) {
            throw { status: 404, message: "Slot not found" };
        }

        await this.checkSalonOwnership(slot.salonId, ownerId);

        if (!["available", "full", "blocked"].includes(status)) {
            throw { status: 400, message: "Invalid status" };
        }

        return await slotRepository.update(id, { status });
    }

    // Customer / Booking Engine Method
    async reserveSlot(id) {
        const slot = await slotRepository.findById(id);
        if (!slot) throw { status: 404, message: "Slot not found" };

        if (slot.status === "blocked") throw { status: 400, message: "Slot is blocked" };
        if (slot.status === "full" || slot.bookingsCount >= slot.capacity) {
             throw { status: 400, message: "Slot is full" };
        }
        
        const now = new Date();
        if (slot.status === "reserved" && slot.lockExpiresAt > now) {
            throw { status: 400, message: "Slot is temporarily reserved by another user. Try again later." };
        }

        // Lock slot for 5 mins
        const lockExpiresAt = new Date(now.getTime() + 5 * 60000);
        
        let newStatus = "reserved";
        if(slot.bookingsCount + 1 >= slot.capacity) {
           newStatus = "reserved"; // Still reserved until payment
        }

        return await slotRepository.update(id, { 
            status: newStatus,
            lockExpiresAt 
        });
    }
}

export default new SlotService();
