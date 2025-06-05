const Joi = require("joi");

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

// One slot (used for all days)
const timeSlotSchema = Joi.object({
  startTime: Joi.string().pattern(timePattern).required(),
  endTime: Joi.string().pattern(timePattern).required(),
});

// Availability schema matching your mongoose model
const availabilitySchema = Joi.object({
  Sunday: Joi.array().items(timeSlotSchema).default([]),
  Monday: Joi.array().items(timeSlotSchema).default([]),
  Tuesday: Joi.array().items(timeSlotSchema).default([]),
  Wednesday: Joi.array().items(timeSlotSchema).default([]),
  Thursday: Joi.array().items(timeSlotSchema).default([]),
  Friday: Joi.array().items(timeSlotSchema).default([]),
  Saturday: Joi.array().items(timeSlotSchema).default([]),
});

const createServiceSchema = Joi.object({
  serviceName: Joi.string().required(),
  description: Joi.string().required(),
  duration: Joi.number().required(),
  courseType: Joi.string().valid("one-on-one", "fixed-course"),
  price: Joi.number().required(),
  active: Joi.boolean().default(true),
  // availability: Joi.array()
  //   .items(
  //     Joi.object({
  //       day: Joi.string().valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"),
  //       startTime: Joi.string().pattern(timePattern),
  //       endTime: Joi.string().pattern(timePattern),
  //     })
  //   )
  //   .when("courseType", {
  //     is: "one-on-one",
  //     otherwise: Joi.forbidden(),
  //   }),
  availability : Joi.when('courseType',{
    is : 'one-on-one',
    then : availabilitySchema,
    otherwise : Joi.forbidden(),
  }),

  fromDate: Joi.date().when("courseType", {
    is: "fixed-course",
    otherwise: Joi.forbidden(),
  }),

  toDate: Joi.date().when("courseType", {
    is: "fixed-course",
    otherwise: Joi.forbidden(),
  }),

  fixedDays: Joi.array().items(Joi.string().valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")).when("courseType", {
    is: "fixed-course",
    otherwise: Joi.forbidden(),
  }),

  fixedStartTime: Joi.string().pattern(timePattern).when("courseType", {
    is: "fixed-course",
    otherwise: Joi.forbidden(),
  }),

  fixedEndTime: Joi.string().pattern(timePattern).when("courseType", {
    is: "fixed-course",
    otherwise: Joi.forbidden(),
  }),
});

module.exports = {
  createServiceSchema,
};
