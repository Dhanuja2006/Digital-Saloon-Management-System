import bookingService from "../services/booking.service.js";

class BookingController {
    async createBooking(req, res, next) {
        try {
            const booking = await bookingService.createBooking(req.user._id, req.body);
            res.status(201).json({
                success: true,
                message: "Booking created successfully",
                data: booking,
            });
        } catch (error) {
            next(error);
        }
    }

    async getMyBookings(req, res, next) {
        try {
            const bookings = await bookingService.getMyBookings(req.user._id);
            res.status(200).json({
                success: true,
                count: bookings.length,
                data: bookings,
            });
        } catch (error) {
            next(error);
        }
    }

    async getSalonBookings(req, res, next) {
        try {
            const bookings = await bookingService.getSalonBookings(req.params.salonId, req.user._id);
            res.status(200).json({
                success: true,
                count: bookings.length,
                data: bookings,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateBookingStatus(req, res, next) {
        try {
            const { status } = req.body;
            const booking = await bookingService.updateBookingStatus(req.params.id, status);
            res.status(200).json({
                success: true,
                message: `Booking status updated to ${status}`,
                data: booking,
            });
        } catch (error) {
            next(error);
        }
    }

    async cancelBooking(req, res, next) {
        try {
            const booking = await bookingService.cancelBooking(req.params.id, req.user._id);
            res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                data: booking,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllBookings(req, res, next) {
        try {
            const bookings = await bookingService.getAllBookings(req.query);
            res.status(200).json({
                success: true,
                count: bookings.length,
                data: bookings,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new BookingController();
