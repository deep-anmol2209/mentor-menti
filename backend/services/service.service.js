const {ServiceModel} = require("../models/service.model");

const createService = async(serviceData) =>{
    return await ServiceModel.create(serviceData);
};

const updateService = async(serviceId, mentorId, updateData) =>{
    return await ServiceModel.findOneAndUpdate(
    {
        _id:serviceId,
        mentor:mentorId,
    },
    updateData,
    {new:true}

)
};

// Improved date comparison helper
const isSameDate = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getUTCFullYear() === d2.getUTCFullYear() &&
           d1.getUTCMonth() === d2.getUTCMonth() &&
           d1.getUTCDate() === d2.getUTCDate();
  };
  
  // Improved time slot checking
  const isTimeSlotAvailable = async (serviceId, bookingDate, startTime, endTime) => {
    try {
      // 1. Find the service
      const service = await ServiceModel.findById(serviceId).lean();
      if (!service) {
        console.error("Service not found");
        return false;
      }
  
      // 2. Check availability array
      if (!Array.isArray(service.availability)) {
        console.error("Service availability is not an array");
        return false;
      }
  
      // 3. Normalize dates to compare just the date part
      const requestedDate = new Date(bookingDate);
      requestedDate.setUTCHours(0, 0, 0, 0);
  
      console.log('Checking availability for:', {
        requestedDate: requestedDate.toISOString(),
        startTime,
        endTime,
        availabilityDates: service.availability.map(a => a.date)
      });
  
      // 4. Find matching availability day
      const dayAvailability = service.availability.find(entry => {
        if (!entry?.date) return false;
        const entryDate = new Date(entry.date);
        entryDate.setUTCHours(0, 0, 0, 0);
        return entryDate.getTime() === requestedDate.getTime();
      });
  
      if (!dayAvailability) {
        console.log('No availability found for this date');
        return false;
      }
  
      console.log('Day availability found:', {
        date: dayAvailability.date,
        timeSlots: dayAvailability.timeSlots
      });
  
      // 5. Check if the exact time slot exists
      const timeSlotExists = dayAvailability.timeSlots.some(
        slot => slot.startTime === startTime && slot.endTime === endTime
      );
  
      console.log('Time slot exists:', timeSlotExists);
      return timeSlotExists;
  
    } catch (err) {
      console.error("Error in isTimeSlotAvailable:", err);
      return false;
    }
  };
const getServiceByMentor = async(mentorId) => {
    return await ServiceModel.find({mentor:mentorId})
};

const getServiceById = async(serviceId) => {
    console.log(serviceId);
    
    return await ServiceModel.findById(serviceId)
};

module.exports = {
    createService, 
    updateService,
    getServiceByMentor,
    getServiceById,
    isTimeSlotAvailable
}