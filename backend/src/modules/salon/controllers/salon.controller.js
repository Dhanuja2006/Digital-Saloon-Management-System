import salonService from "../services/salon.service.js";

class SalonController {
    async createSalon(req, res, next) {
        try {
            const salon = await salonService.createSalon(req.user.id, req.body);
            res.status(201).json({
                success: true,
                message: "Salon created successfully. Awaiting admin approval.",
                data: salon,
            });
        } catch (error) {
            next(error);
        }
    }

    async getSalons(req, res, next) {
        try {
            const salons = await salonService.getSalons(req.query);
            res.status(200).json({
                success: true,
                count: salons.length,
                data: salons,
            });
        } catch (error) {
            next(error);
        }
    }

    async getMySalons(req, res, next) {
        try {
            const salons = await salonService.getMySalons(req.user.id);
            res.status(200).json({
                success: true,
                count: salons.length,
                data: salons,
            });
        } catch (error) {
            next(error);
        }
    }

    async getSalonById(req, res, next) {
        try {
            const salon = await salonService.getSalonById(req.params.id);
            res.status(200).json({
                success: true,
                data: salon,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateSalon(req, res, next) {
        try {
            const salon = await salonService.updateSalon(req.params.id, req.user.id, req.body);
            res.status(200).json({
                success: true,
                message: "Salon updated successfully",
                data: salon,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteSalon(req, res, next) {
        try {
            await salonService.deleteSalon(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: "Salon deactivated successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    // Admin Controllers
    async getPendingSalons(req, res, next) {
        try {
            const salons = await salonService.getPendingSalons();
            res.status(200).json({
                success: true,
                count: salons.length,
                data: salons,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateSalonStatus(req, res, next) {
        try {
            const { status } = req.body;
            const salon = await salonService.updateSalonStatus(req.params.id, status);
            res.status(200).json({
                success: true,
                message: `Salon status updated to ${status}`,
                data: salon,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new SalonController();
