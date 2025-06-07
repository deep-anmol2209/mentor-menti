const Joi = require('joi');

const initiateBookingValidation = Joi.object({
  serviceId: Joi.string().required(),
  bookingDate: Joi.date().iso().required(), // Use ISO format like '2024-06-01'
  startTime: Joi.string().optional(),       // Required only for one-on-one, optional here
  endTime: Joi.string().optional(), 
  duration: Joi.number().optional()        // Required only for one-on-one, optional here
});

module.exports = {
  initiateBookingValidation,
};
