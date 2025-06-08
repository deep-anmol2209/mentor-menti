const Razorpay = require('razorpay');
const config = require('../config');
const httpStatus = require('../util/httpStatus');
const serviceService = require('../services/service.service');
const bookingService = require('../services/booking.service');

const initiateBookingAndPayment = async (req, res) => {
    const { bookingDate, startTime, endTime, serviceId, duration } = req.body;
    const service = await serviceService.getServiceById(serviceId);
    
    if (!service) {
        return res.status(httpStatus.badRequest).json({
            success: false,
            msg: "Service not found",
        });
    }

    // ONE-ON-ONE: Check slot availability and conflicts
    if (service.courseType === "one-on-one") {
        const isSlotAvailable = await serviceService.isTimeSlotAvailable(
            service._id, bookingDate, startTime, endTime
        );
        
        if (!isSlotAvailable) {
            return res.status(httpStatus.badRequest).json({
                success: false,
                msg: "This time slot is not available for booking",
            });
        }

        const isSlotTaken = await bookingService.isSlotAlreadyBooked({
            mentor: service.mentor,
            bookingDate,
            startTime,
            endTime
        });

        if (isSlotTaken) {
            return res.status(httpStatus.badRequest).json({
                success: false,
                msg: "This slot is already booked. Please choose another time.",
            });
        }
    }

    // FIXED COURSE: Just verify dates are within course range
    if (service.courseType === "fixed-course") {
        const bookingDateObj = new Date(bookingDate);
        if (bookingDateObj < new Date(service.fromDate) || 
            bookingDateObj > new Date(service.toDate)) {
            return res.status(httpStatus.badRequest).json({
                success: false,
                msg: "Selected date is not within course dates",
            });
        }
    }

    // Create booking
    const bookingData = {
        mentor: service.mentor,
        service: serviceId,
        price: service.price,
        duration,
        serviceType: service.courseType,
        status: 'pending'
    };

    if (service.courseType === "one-on-one") {
        bookingData.user = req.user._id;
        bookingData.bookingDate = bookingDate;
        bookingData.startTime = startTime;
        bookingData.endTime = endTime;
    } else {
        // For fixed courses, add to users array
        bookingData.users = [req.user._id];
        bookingData.currentSessionDate = bookingDate;
        bookingData.courseDates = bookingService.generateCourseDates(service); // Implement this
    }

    const newBooking = await bookingService.createBooking(bookingData);
    
    res.status(httpStatus.created).json({
        success: true,
        booking: newBooking,
    });
};


const getBookings = async(req,res)=>{
    const bookings = await bookingService.getUsersBooking(req.user._id);
    res.status(httpStatus.ok).json({
        success : true, 
        bookings
    });
};


const getMentorBookings = async(req,res)=>{
    const bookings = await bookingService.getMentorBookings(req.user._id);
    res.status(httpStatus.ok).json({
        success : true,
        bookings
    });
};


module.exports = {
    initiateBookingAndPayment,
    getBookings,
    getMentorBookings
}

