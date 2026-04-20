import salonRepository from "../repositories/salon.repository.js";

class SalonService {
    async createSalon(ownerId, salonData) {
        // Check for existing salon with same name and address for this owner
        const existingSalon = await salonRepository.findOne({
            ownerId,
            salonName: salonData.salonName,
            address: salonData.address,
        });

        if (existingSalon) {
            throw { status: 400, message: "You already have a salon registered with this name and address." };
        }

        const newSalon = await salonRepository.create({
            ...salonData,
            ownerId,
            status: "pending", // Enforce pending status on creation
        });

        return newSalon;
    }

    async getSalonById(id) {
        const salon = await salonRepository.findById(id);
        if (!salon) {
            throw { status: 404, message: "Salon not found" };
        }
        return salon;
    }

    async getMySalons(ownerId) {
        return await salonRepository.findAll({ ownerId });
    }

    async getSalons(filters = {}) {
        const query = { isActive: true, status: "approved" };

        if (filters.city) {
            query.city = { $regex: new RegExp(filters.city, "i") };
        }

        return await salonRepository.findAll(query);
    }

    async updateSalon(id, ownerId, updateData) {
        const salon = await this.getSalonById(id);

        if (salon.ownerId._id.toString() !== ownerId.toString()) {
            throw { status: 403, message: "Not authorized to update this salon" };
        }

        // Prevent updating critical fields directly
        delete updateData.status;
        delete updateData.totalBookings;
        delete updateData.totalRevenue;
        delete updateData.ownerId;

        return await salonRepository.update(id, updateData);
    }

    async deleteSalon(id, ownerId) {
        const salon = await this.getSalonById(id);

        if (salon.ownerId._id.toString() !== ownerId.toString()) {
            throw { status: 403, message: "Not authorized to delete this salon" };
        }

        return await salonRepository.delete(id);
    }

    // Admin Methods
    async getPendingSalons() {
        return await salonRepository.findAll({ status: "pending" });
    }

    async updateSalonStatus(id, status) {
        if (!["pending", "approved", "suspended"].includes(status)) {
            throw { status: 400, message: "Invalid status value" };
        }
        return await salonRepository.update(id, { status });
    }
}

export default new SalonService();
