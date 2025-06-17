const Joi = require('joi');

const initiateBookingValidation = Joi.object({
  serviceId: Joi.string().required(),
  bookingDate: Joi.date().iso().required(), // Use ISO format like '2024-06-01'
  startTime: Joi.string().optional(),       // Required only for one-on-one, optional here
  endTime: Joi.string().optional(), 
  duration: Joi.number().optional(),
  createdAt: Joi.date().iso().optional()    // Required only for one-on-one, optional here
});

const timeSlotSchema = Joi.object({
  startTime: Joi.string().required(), // e.g., "18:00"
  endTime: Joi.string().required(),   // e.g., "20:00"
});

const rescheduleSlotSchema = Joi.object({
  date: Joi.date().iso().required(),  // e.g., "2025-06-19"
  timeSlots: Joi.array().items(timeSlotSchema).required(),
});

const updateBookingValidation = Joi.object({
  bookingDate: Joi.date().iso().required(), // ISO format
  createdAt: Joi.date().iso().required(),
  duration: Joi.number().integer().min(1).required(),
  endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(), // "HH:mm"
  expireAt: Joi.date().iso().allow(null),
  isFixedCourseSession: Joi.boolean().required(),
  meetingLink: Joi.string().uri().required(),
  mentor: Joi.string().length(24).hex().required(),
  price: Joi.number().min(0).required(),
  rescheduleRequested: Joi.boolean().required(),
  rescheduleSlots: Joi.array().items(rescheduleSlotSchema).optional(),
  service: Joi.string().length(24).hex().required(),
  serviceType: Joi.string().valid('one-on-one', 'fixed-course').required(),
  startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(), // "HH:mm"
  status: Joi.string().valid(
    'pending',
    'confirmed',
    'cancelled',
    'completed',
    'rescheduled',
    'reschedulerequest'
  ).required(),
  user: Joi.string().length(24).hex().required(),
  __v: Joi.number().optional(),
  _id: Joi.string().length(24).hex().optional(), // Optional if you validate client input
});
module.exports = {
  initiateBookingValidation,
  updateBookingValidation
};
