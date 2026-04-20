import Service from "../models/Service.js";

class ServiceRepository {
    async create(serviceData) {
        const service = new Service(serviceData);
        return await service.save();
    }

    async findById(id) {
        return await Service.findById(id);
    }

    async findAllBySalonId(salonId) {
        return await Service.find({ salonId, isActive: true });
    }

    async update(id, updateData) {
        return await Service.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async delete(id) {
        // Soft delete
        return await Service.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }
}

export default new ServiceRepository();
