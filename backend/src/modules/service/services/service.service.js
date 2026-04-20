import serviceRepository from "../repositories/service.repository.js";
import salonRepository from "../../salon/repositories/salon.repository.js";

class ServiceService {
    async checkSalonOwnership(salonId, ownerId) {
        const salon = await salonRepository.findById(salonId);
        if (!salon) {
            throw { status: 404, message: "Salon not found" };
        }
        if (salon.ownerId._id.toString() !== ownerId.toString()) {
            throw { status: 403, message: "Not authorized to manage services for this salon" };
        }
        return salon;
    }

    async createService(ownerId, serviceData) {
        // Validate ownership of the salon
        await this.checkSalonOwnership(serviceData.salonId, ownerId);

        return await serviceRepository.create(serviceData);
    }

    async getSalonServices(salonId) {
        return await serviceRepository.findAllBySalonId(salonId);
    }

    async getServiceById(id) {
        const service = await serviceRepository.findById(id);
        if (!service) {
            throw { status: 404, message: "Service not found" };
        }
        return service;
    }

    async updateService(id, ownerId, updateData) {
        const service = await this.getServiceById(id);
        await this.checkSalonOwnership(service.salonId, ownerId);

        // Prevent modification of salonId
        delete updateData.salonId;

        return await serviceRepository.update(id, updateData);
    }

    async deleteService(id, ownerId) {
        const service = await this.getServiceById(id);
        await this.checkSalonOwnership(service.salonId, ownerId);

        return await serviceRepository.delete(id);
    }
}

export default new ServiceService();
