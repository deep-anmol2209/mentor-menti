const {ServiceModel} = require("../models/service.model");
const mongoose = require("mongoose")
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
  const isTimeSlotAvailable = async (mentorId, newAvailability) => {
    try {
    const services = await ServiceModel.find({ mentor: mentorId }).lean();
    
    
    if (!services.length) return true;
    
    const toDateTime = (date, timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      const dt = new Date(date);
      dt.setUTCHours(hours, minutes, 0, 0);
      return dt;
    };
    
    for (const newEntry of newAvailability) {
      const newDate = new Date(newEntry.date);
      newDate.setUTCHours(0, 0, 0, 0);
    
      for (const newSlot of newEntry.timeSlots) {
        const newStart = toDateTime(newDate, newSlot.startTime);
        const newEnd = toDateTime(newDate, newSlot.endTime);
    
        for (const service of services) {
          if (!Array.isArray(service.availability)) continue;
    
          const existingDay = service.availability.find(entry => {
            const entryDate = new Date(entry.date);
            entryDate.setUTCHours(0, 0, 0, 0);
            return entryDate.getTime() === newDate.getTime();
          });
    
          if (!existingDay) continue;
    
          const conflict = existingDay.timeSlots.some(slot => {
            if (slot._id && newSlot._id && slot._id.toString() === newSlot._id.toString()) {
              return false;
            }
          
            const existingStart = toDateTime(newDate, slot.startTime);
            const existingEnd = toDateTime(newDate, slot.endTime);
          
            return (
              (newStart >= existingStart && newStart < existingEnd) ||
              (newEnd > existingStart && newEnd <= existingEnd) ||
              (newStart <= existingStart && newEnd >= existingEnd)
            );
          });
          
    
          if (conflict) {
            console.log(`⛔ Conflict on ${newDate.toISOString()} between ${newSlot.startTime} - ${newSlot.endTime}`);
            return false;
          }
        }
      }
    }
    
    return true;
    }catch(error){
      console.log(error);
      
    }}
  
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