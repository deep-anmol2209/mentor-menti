const Razorpay = require('razorpay');
const config = require('../config');
const httpStatus = require('../util/httpStatus');
const serviceService = require('../services/service.service');
const bookingService = require('../services/booking.service');

const initiateBookingAndPayment = async (req, res) => {
    const { bookingDate, startTime, endTime, serviceId, duration } = req.body;
  console.log(req.body);
  
    const service = await serviceService.getServiceById(serviceId);
    if (!service) {
      return res.status(httpStatus.badRequest).json({
        success: false,
        msg: "Service not found",
      });
    }
  
    // For one-on-one services, validate the time slot exists in mentor's availability
    if (service.courseType === "one-on-one") {
      const isSlotAvailable = await serviceService.isTimeSlotAvailable(
        service.mentor,
        bookingDate,
        startTime,
        endTime
      );
      
      if (!isSlotAvailable) {
        return res.status(httpStatus.badRequest).json({
          success: false,
          msg: "This time slot is not available for booking",
        });
      }
    }
  
    // Check if slot is already booked
    const isSlotTaken = await bookingService.isSlotAlreadyBooked({
      mentor: service.mentor,
      bookingDate,
      startTime,
      endTime,
    });
  
    if (isSlotTaken) {
      return res.status(httpStatus.badRequest).json({
        success: false,
        msg: "This slot is already booked. Please choose another time.",
      });
    }
  
    // Create a new booking
    const newBooking = await bookingService.createBooking({
      user: req.user._id,
      mentor: service.mentor,
      service: serviceId,
      price: service.price,
      duration,
      serviceType: service.courseType,
      ...(service.courseType === "one-on-one"
        ? { bookingDate, startTime, endTime }
        : { sessionDate: bookingDate }), // For fixed courses
    });
  
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
