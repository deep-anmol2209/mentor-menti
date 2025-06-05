const Joi = require('joi');

const initiateBookingValidation = Joi.object({
    serviceId : Joi.string().required(),
    datAndTime : Joi.string().required(),
});

module.exports = {
    initiateBookingValidation,
}