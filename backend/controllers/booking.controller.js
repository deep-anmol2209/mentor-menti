const Razorpay = require('razorpay');
const config = require('../config');
const BookingModel= require("../models/booking.model")
const httpStatus = require('../util/httpStatus');
const serviceService = require('../services/service.service');
const bookingService = require('../services/booking.service');

const initiateBookingAndPayment = async (req, res) => {
    const { bookingDate, serviceId } = req.body;
    const service = await serviceService.getServiceById(serviceId);
    
    if (!service) {
        return res.status(400).json({ success: false, msg: "Service not found" });
    }

    // ONE-ON-ONE: Check slot availability and conflicts
    if (service.courseType === "one-on-one") {
        const { startTime, endTime } = req.body;
        
        // Existing slot availability checks...
        const isSlotTaken = await BookingModel.exists({
            mentor: service.mentor,
            serviceType: 'one-on-one',
            status: { $ne: 'cancelled' },
            bookingDate: new Date(bookingDate),
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        });

        if (isSlotTaken) {
            return res.status(400).json({
                success: false,
                msg: "This slot is already booked"
            });
        }
    }
    // FIXED COURSE: Just verify date is within course range
    else {
        const bookingDateObj = new Date(bookingDate);
        if (bookingDateObj < new Date(service.fromDate) || 
            bookingDateObj > new Date(service.toDate)) {
            return res.status(400).json({
                success: false,
                msg: "Selected date not within course dates"
            });
        }
    }

    // Create booking
    const bookingData = {
        user: req.user._id,
        mentor: service.mentor,
        service: serviceId,
        price: service.price,
        duration: service.duration,
        serviceType: service.courseType,
        status: 'pending',
        ...(service.courseType === "one-on-one" ? {
            bookingDate,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        } : {
            bookingDate,
            startTime: req.body.startTime,
            isFixedCourseSession: true
        })
    };

    const newBooking = await BookingModel.create(bookingData);
    
    res.status(201).json({
        success: true,
        booking: newBooking
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

const getBookingsByUsername= async(req, res)=>{
const {username}= req.params
    const bookings= await bookingService.getMentorBookingsByUsername(username);

    res.status(httpStatus.ok).json({
        success: true,
        bookings
    })
}


module.exports = {
    initiateBookingAndPayment,
    getBookings,
    getMentorBookings,
    getBookingsByUsername
}
