import Salon from "../models/Salon.js";

class SalonRepository {
    async create(salonData) {
        const salon = new Salon(salonData);
        return await salon.save();
    }

    async findById(id) {
        return await Salon.findById(id).populate("ownerId", "fullName email");
    }

    async findByOwnerId(ownerId) {
        return await Salon.findOne({ ownerId });
    }

    async findOne(query) {
        return await Salon.findOne(query);
    }

    async findAll(query = {}) {
        return await Salon.find(query);
    }

    async update(id, updateData) {
        return await Salon.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async delete(id) {
        return await Salon.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }
}

export default new SalonRepository();
