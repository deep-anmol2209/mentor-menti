const BookingModel = require('../models/booking.model');
const UserModel= require('../models/user.model')
const createBooking = async(bookingData)=>{
    return await BookingModel.create(bookingData);
};

const getBookingById = async(bookingId) => {
    return await BookingModel.findById(bookingId)
    .populate('service')
    .populate('user');
};

const updateBookingById = async (bookingId, bookingData) => {
    const update = {
      $set: { ...bookingData }
    };
  
    // Remove `expireAt` when status is no longer 'pending'
    if (bookingData.status && bookingData.status !== 'pending') {
      update.$unset = { expireAt: "" };
    }
  
    return await BookingModel.findByIdAndUpdate(bookingId, update, {
      new: true,
    });
  };


  

const isSlotAlreadyBooked = async ({ mentor, bookingDate, startTime, endTime }) => {
    try {
        const startOfDay = new Date(bookingDate);
        startOfDay.setUTCHours(0, 0, 0, 0);
        
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);

        return await BookingModel.exists({
            mentor,
            serviceType: 'one-on-one',
            status: { $ne: 'cancelled' },
            bookingDate: { $gte: startOfDay, $lt: endOfDay },
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
                { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
                { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
            ]
        });
    } catch (error) {
        console.error('Error checking slot availability:', error);
        return true; // Fail safe
    }
};



function generateCourseDates(service) {
    const dates = [];
    const current = new Date(service.fromDate);
    const end = new Date(service.toDate);
    
    while (current <= end) {
        if (service.fixedDays.includes(getDayName(current))) {
            dates.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
    }
    
    return dates;
}

function getDayName(date) {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 
            'Thursday', 'Friday', 'Saturday'][date.getDay()];
}

const getUsersBooking = async(userId) =>{
    return await BookingModel.find({user:userId});
};

const getMentorBookings = async(mentorId)=>{
    return await BookingModel.find({mentor:mentorId});
};

const getMentorBookingsByUsername = async (username) => {
    // First find the mentor by username (assuming you have access to MentorModel)
    const mentor = await UserModel.findOne({ username });
    if (!mentor) return [];
    
    // Then find all bookings for this mentor
    return await BookingModel.find({ mentor: mentor._id })
        .populate('service')
        .populate('user');
};

const rescheduleBooking= async (bookingId, bookingData)=>{
    console.log("reschedule: ",bookingData);
    
return await BookingModel.findByIdAndUpdate(bookingId, {...bookingData}, {new: true}).populate('user');
}

const findAndUpdateById= async(bookingId, bookingData)=>{
    return await BookingModel.findByIdAndUpdate(bookingId, bookingData, {new: true})
}
module.exports = {
     createBooking,
     getBookingById,
     updateBookingById,
     getUsersBooking,
     getMentorBookings,
     isSlotAlreadyBooked,
     generateCourseDates,
     getMentorBookingsByUsername,
     rescheduleBooking,
     findAndUpdateById
}