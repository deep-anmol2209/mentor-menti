const ApiError = require("../helper/apiError");
const ServiceModel = require("../models/service.model");
const serviceService = require("../services/service.service");
const httpStatus = require("../util/httpStatus");

const createService = async (req, res, next) => {
  try {
    const mentorId = req.user._id;
    const {
      serviceName,
      description,
      duration,
      courseType,
      price,
      availability,
      fixedDays,
      fixedEndTime,
      fixedStartTime,
      fromDate,
      toDate,
    } = req.body;

    // Basic validation
    if (!serviceName || !description || !duration || !courseType || !price) {
      return res.status(httpStatus.badRequest).json({ success: false, message: "Missing required fields." });
    }

    if (courseType === 'fixed-course') {
      if (!fromDate || !toDate || !fixedDays?.length || !fixedStartTime || !fixedEndTime) {
        return res.status(httpStatus.badRequest).json({ success: false, message: "Missing required fields for fixed-course." });
      }
    }

    if (courseType === 'one-on-one') {
      if (!Array.isArray(availability) || availability.length === 0) {
        return res.status(httpStatus.badRequest).json({ success: false, message: "Availability is required for one-on-one." });
      }

      // Optional: validate each availability entry
      for (const slot of availability) {
        if (!slot.date || !Array.isArray(slot.timeSlots) || slot.timeSlots.length === 0) {
          return res.status(httpStatus.badRequest).json({ success: false, message: "Each availability entry must have a date and at least one time slot." });
        }

        for (const time of slot.timeSlots) {
          if (!time.startTime || !time.endTime) {
            return res.status(httpStatus.badRequest).json({ success: false, message: "Each time slot must have startTime and endTime." });
          }
        }
      }
    }

    // Create the service
    const service = await serviceService.createService({
      mentor: mentorId,
      serviceName,
      description,
      duration,
      courseType,
      price,
      availability,
      fixedDays,
      fixedEndTime,
      fixedStartTime,
      fromDate,
      toDate,
    });

    res.status(httpStatus.created).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    next(error);
  }
};



const updateService = async (req, res, next) => {
  try {
    const serviceId = req.params.serviceId;
    const mentorId = req.user._id;
    const {
      serviceName,
      description,
      duration,
      courseType,
      price,
      availability,
      fixedDays,
      fixedEndTime,
      fixedStartTime,
      fromDate,
      toDate,
    } = req.body;

    // Basic validation
    if (!serviceName || !description || !duration || !courseType || !price) {
      return res.status(httpStatus.badRequest).json({ 
        success: false, 
        message: "Missing required fields." 
      });
    }

    // Course type specific validation
    if (courseType === 'fixed-course') {
      if (!fromDate || !toDate || !fixedDays?.length || !fixedStartTime || !fixedEndTime) {
        return res.status(httpStatus.badRequest).json({ 
          success: false, 
          message: "Missing required fields for fixed-course." 
        });
      }
    }

    if (courseType === 'one-on-one') {

      const result = await serviceService.isTimeSlotAvailable(mentorId, availability)
      console.log("result: ", result);
if(!result){
return res.status(httpStatus.badRequest).json({success: false, message: "slot conflict"})
}
      
      
      // if (!Array.isArray(availability) || availability.length === 0) {
      //   return res.status(httpStatus.badRequest).json({ 
      //     success: false, 
      //     message: "Availability is required for one-on-one." 
      //   });
      // }

      // // Validate each availability entry
      // for (const slot of availability) {
      //   if (!slot.date || !Array.isArray(slot.timeSlots) || slot.timeSlots.length === 0) {
      //     return res.status(httpStatus.badRequest).json({ 
      //       success: false, 
      //       message: "Each availability entry must have a date and at least one time slot." 
      //     });
      //   }

      //   for (const time of slot.timeSlots) {
      //     if (!time.startTime || !time.endTime) {
      //       return res.status(httpStatus.badRequest).json({ 
      //         success: false, 
      //         message: "Each time slot must have startTime and endTime." 
      //       });
      //     }
      //   }
      // }
    }

    // Update the service
    const updatedService = await serviceService.updateService(
      serviceId, 
      mentorId, 
      {
        serviceName,
        description,
        duration,
        courseType,
        price,
        availability,
        fixedDays,
        fixedEndTime,
        fixedStartTime,
        fromDate,
        toDate,
      }
    );

    if (!updatedService) {
      throw new ApiError(httpStatus.notFound, "Service not found or you don't have permission to update it");
    }

    res.status(httpStatus.ok).json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    next(error);
  }
};

const getServiceByMentor = async (req, res, next) => {
  try {
    const mentorId = req.user._id;
        
    const service = await serviceService.getServiceByMentor(mentorId);

    if (!service || service.length === 0) {
      return res.status(httpStatus.notFound).json({
        success: false,
        message: "No services found for this mentor",
      });
    }

    res.status(httpStatus.ok).json({
      success: true,
      service,
    });
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const serviceId = req.params.serviceId;
    
    const service = await serviceService.getServiceById(serviceId);
    
        
    if (!service) {
      return res.status(httpStatus.notFound).json({
        success: false,
        message: "Service not found!!",
      });
    }

    res.status(httpStatus.ok).json({
      success: true,
      service,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createService,
  updateService,
  getServiceByMentor,
  getServiceById,
};
