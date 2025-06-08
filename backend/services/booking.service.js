const BookingModel = require('../models/booking.model');

const createBooking = async(bookingData)=>{
    return await BookingModel.create(bookingData);
};

const getBookingById = async(bookingId) => {
    return await BookingModel.findById(bookingId)
    .populate('service')
    .populate('user');
};

const updateBookingById = async(bookingId, bookingData)=>{
    return await BookingModel.findByIdAndUpdate(bookingId,bookingData,{
        new:true,
    });
};

const isSlotAlreadyBooked = async ({ mentor, bookingDate, startTime, endTime }) => {
    try {
        // Convert bookingDate to start and end of day in UTC
        const bookingDay = new Date(bookingDate);
        const startOfDay = new Date(bookingDay);
        startOfDay.setUTCHours(0, 0, 0, 0);
        
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);

        // Find any overlapping bookings
        const existingBooking = await BookingModel.findOne({
            mentor: mentor,
            bookingDate: {
                $gte: startOfDay,
                $lt: endOfDay
            },
            status: { $ne: 'cancelled' }, // Ignore cancelled bookings
            $or: [
                // Case 1: Existing booking starts before and ends after our requested start
                { 
                    $and: [
                        { startTime: { $lt: endTime } },
                        { endTime: { $gt: startTime } }
                    ]
                },
                // Case 2: Existing booking completely within requested time
                { 
                    $and: [
                        { startTime: { $gte: startTime } },
                        { endTime: { $lte: endTime } }
                    ]
                },
                // Case 3: Requested time completely within existing booking
                { 
                    $and: [
                        { startTime: { $lte: startTime } },
                        { endTime: { $gte: endTime } }
                    ]
                }
            ]
        });

        if (existingBooking) {
            console.log('Found conflicting booking:', {
                existingStart: existingBooking.startTime,
                existingEnd: existingBooking.endTime,
                requestedStart: startTime,
                requestedEnd: endTime
            });
        }

        return !!existingBooking;
    } catch (error) {
        console.error('Error checking slot availability:', error);
        // Return true on error to be safe (prevent double booking)
        return true;
    }
};

const getUsersBooking = async(userId) =>{
    return await BookingModel.find({user:userId});
};

const getMentorBookings = async(mentorId)=>{
    return await BookingModel.find({mentor:mentorId});
};

module.exports = {
     createBooking,
     getBookingById,
     updateBookingById,
     getUsersBooking,
     getMentorBookings,
     isSlotAlreadyBooked
}