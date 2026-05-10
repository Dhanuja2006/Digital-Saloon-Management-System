import Salon from "../models/Salon.js";

class SalonRepository {
    async create(salonData) {
        const salon = new Salon(salonData);
        return await salon.save();
    }

    async findById(id) {
        if (!id) return null;
        try {
            return await Salon.findById(id).populate("ownerId", "fullName email").lean();
        } catch (err) {
            return null;
        }
    }

    async findByOwnerId(ownerId) {
        return await Salon.findOne({ ownerId }).lean();
    }

    async findOne(query) {
        return await Salon.findOne(query).lean();
    }

    async findAll(query = {}) {
        return await Salon.find(query).lean();
    }

    async update(id, updateData) {
        return await Salon.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true });
    }

    async delete(id) {
        return await Salon.findByIdAndUpdate(id, { isActive: false }, { returnDocument: 'after' });
    }
}

export default new SalonRepository();
