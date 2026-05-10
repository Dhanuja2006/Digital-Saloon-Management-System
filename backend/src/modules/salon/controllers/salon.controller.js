import salonService from "../services/salon.service.js";
import { bucket } from "../../../config/db.js";
import { Readable } from "stream";
import mongoose from "mongoose";


class SalonController {
    async createSalon(req, res, next) {
        try {
            const salon = await salonService.createSalon(req.user, req.body);
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
            const salons = await salonService.getMySalons(req.user._id);
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
            const salon = await salonService.updateSalon(req.params.id, req.user._id, req.body);
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
            await salonService.deleteSalon(req.params.id, req.user._id);
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

    async uploadSalonImages(req, res, next) {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ success: false, message: "No images uploaded" });
            }

            const uploadPromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const readableStream = new Readable();
                    readableStream.push(file.buffer);
                    readableStream.push(null);

                    const filename = `salon-${Date.now()}-${file.originalname}`;
                    const uploadStream = bucket.openUploadStream(filename, {
                        contentType: file.mimetype
                    });

                    readableStream.pipe(uploadStream);

                    uploadStream.on('finish', () => {
                        resolve(`/api/salons/image/${uploadStream.id}`);
                    });

                    uploadStream.on('error', (error) => {
                        reject(error);
                    });
                });
            });

            const imagePaths = await Promise.all(uploadPromises);
            const salon = await salonService.addSalonImages(req.params.id, req.user._id, imagePaths);

            res.status(200).json({
                success: true,
                message: "Images uploaded successfully",
                data: salon,
            });
        } catch (error) {
            next(error);
        }
    }

    async getSalonImage(req, res, next) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: "Invalid image ID" });
            }

            const _id = new mongoose.Types.ObjectId(id);
            const downloadStream = bucket.openDownloadStream(_id);

            downloadStream.on('file', (file) => {
                res.set('Content-Type', file.contentType);
            });

            downloadStream.on('error', () => {
                res.status(404).json({ success: false, message: "Image not found" });
            });

            downloadStream.pipe(res);
        } catch (error) {
            next(error);
        }
    }

    async removeSalonImage(req, res, next) {
        try {
            const { imagePath } = req.body;
            if (!imagePath) {
                return res.status(400).json({ success: false, message: "Image path is required" });
            }

            const salon = await salonService.removeSalonImage(req.params.id, req.user._id, imagePath);

            res.status(200).json({
                success: true,
                message: "Image removed successfully",
                data: salon,
            });
        } catch (error) {
            next(error);
        }
    }

    async getSalonAnalytics(req, res, next) {
        try {
            const analytics = await salonService.getSalonAnalytics(req.params.id, req.user._id);
            res.status(200).json({
                success: true,
                data: analytics,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new SalonController();
