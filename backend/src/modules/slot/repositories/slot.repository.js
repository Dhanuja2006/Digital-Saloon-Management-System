import Slot from "../models/Slot.js";

class SlotRepository {
    async createMany(slots) {
        return await Slot.insertMany(slots);
    }

    async findById(id) {
        return await Slot.findById(id);
    }

    async findAll(query) {
        return await Slot.find(query).sort({ date: 1, startTime: 1 });
    }

    async findOne(query) {
        return await Slot.findOne(query);
    }

    async update(id, updateData) {
        return await Slot.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async deleteMany(query) {
        return await Slot.deleteMany(query);
    }
}

export default new SlotRepository();
