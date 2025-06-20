const Razorpay = require('razorpay');
const config = require('../config');
const BookingModel= require("../models/booking.model")
const httpStatus = require('../util/httpStatus');
const serviceService = require('../services/service.service');
const bookingService = require('../services/booking.service');
const emailService = require('../services/email.service')
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

const getBookingsByUsername = async(req, res)=>{
const {username}= req.params
    const bookings= await bookingService.getMentorBookingsByUsername(username);

    res.status(httpStatus.ok).json({
        success: true,
        bookings
    })
}

const updateBookingById= async(req, res)=>{
console.log('hello');

    const bookingData= req.body;
    console.log(bookingData);
    const bookingId= bookingData._id
   if(!bookingId){
    return res.status(httpStatus.badRequest).json({
        success: false,
        message: "booking Id is missing"
    })
   }
    const booking= await bookingService.rescheduleBooking(bookingId, bookingData);

    if(!booking){
        return res.status(httpStatus.notFound).json({
         success: false,
         message: "booking not found"
        })
    }
   
    await emailService.sendRescheduleRequestMail(
        booking.user.email,
        booking.user.name,
        'https://mentor-menti-uint.vercel.app/dashboard/bookings'
      );
    
    res.status(httpStatus.ok).json({
        success: true,
        booking
    })
}


// In your booking controller
const checkTimeConflict = async (req, res) => {
    const { mentor, date, startTime, endTime, excludeBookingId } = req.body;
    
    const conflict = await BookingModel.exists({
      _id: { $ne: excludeBookingId },
      mentor,
      status: { $nin: ['cancelled', 'completed'] },
      $or: [
        {
          bookingDate: new Date(date),
          $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
          ]
        },
        {
          'rescheduleSlots.date': new Date(date),
          'rescheduleSlots.timeSlot.startTime': { $lt: endTime },
          'rescheduleSlots.timeSlot.endTime': { $gt: startTime }
        }
      ]
    });
  
    res.json({ conflict: !!conflict });
  };


  const rescheduleBooking = async (req, res) => {
    try {
      const { bookingId, bookingDate, startTime, endTime, status } = req.body;
  
      // Validate required fields
      if (!bookingId || !bookingDate || !startTime || !endTime) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Find and update the booking
      const updatedBooking = await bookingService.findAndUpdateById(
        bookingId,
        {
          bookingDate,
          startTime,
          endTime,
          status: status || "rescheduled", 
        },
       
      );
  
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      await emailService.sendConfirmationMail(
        updatedBooking.user.email,
        updatedBooking.user.name,
        updatedBooking.status,
        updatedBooking.meetingLink
      );
      res.status(200).json({
        message: "Booking rescheduled successfully",
        booking: updatedBooking,
      });
    } catch (error) {
      console.error("Reschedule error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

module.exports = {
    initiateBookingAndPayment,
    getBookings,
    getMentorBookings,
    getBookingsByUsername,
    updateBookingById,
    checkTimeConflict,
    rescheduleBooking
}

