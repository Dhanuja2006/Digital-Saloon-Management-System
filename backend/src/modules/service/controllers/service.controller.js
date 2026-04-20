import serviceService from "../services/service.service.js";

class ServiceController {
    async createService(req, res, next) {
        try {
            const service = await serviceService.createService(req.user.id, req.body);
            res.status(201).json({
                success: true,
                message: "Service created successfully",
                data: service,
            });
        } catch (error) {
            next(error);
        }
    }

    async getSalonServices(req, res, next) {
        try {
            const services = await serviceService.getSalonServices(req.params.salonId);
            res.status(200).json({
                success: true,
                count: services.length,
                data: services,
            });
        } catch (error) {
            next(error);
        }
    }

    async getServiceById(req, res, next) {
        try {
            const service = await serviceService.getServiceById(req.params.id);
            res.status(200).json({
                success: true,
                data: service,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateService(req, res, next) {
        try {
            const service = await serviceService.updateService(req.params.id, req.user.id, req.body);
            res.status(200).json({
                success: true,
                message: "Service updated successfully",
                data: service,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteService(req, res, next) {
        try {
            await serviceService.deleteService(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: "Service deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ServiceController();
