const Joi = require("joi");

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

// One time slot object
const timeSlotSchema = Joi.object({
  startTime: Joi.string().pattern(timePattern).required(),
  endTime: Joi.string().pattern(timePattern).required(),
});

// Availability for one-on-one sessions — array of date + timeSlots
const oneOnOneAvailabilitySchema = Joi.array().items(
  Joi.object({
    date: Joi.string().isoDate().required(), // e.g., "2025-06-10"
    timeSlots: Joi.array().items(timeSlotSchema).required(),
  })
);

// Schema for fixed-course availability (unchanged from your original)
const fixedCourseAvailabilitySchema = Joi.object({
  Sunday: Joi.array().items(timeSlotSchema).default([]),
  Monday: Joi.array().items(timeSlotSchema).default([]),
  Tuesday: Joi.array().items(timeSlotSchema).default([]),
  Wednesday: Joi.array().items(timeSlotSchema).default([]),
  Thursday: Joi.array().items(timeSlotSchema).default([]),
  Friday: Joi.array().items(timeSlotSchema).default([]),
  Saturday: Joi.array().items(timeSlotSchema).default([]),
});
const createServiceSchema = Joi.object({
  mentor: Joi.string().hex().length(24).required(), // 👈 Add this line
  serviceName: Joi.string().required(),
  description: Joi.string().required(),
  duration: Joi.number().required(),
  courseType: Joi.string().valid("one-on-one", "fixed-course").required(),
  price: Joi.number().required(),
  active: Joi.boolean().default(true),
  availability: Joi.when("courseType", {
    is: "one-on-one",
    then: oneOnOneAvailabilitySchema.required(),
    otherwise: Joi.forbidden(),
  }),
  
  fromDate: Joi.date().when("courseType", {
    is: "fixed-course",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),

  toDate: Joi.date().when("courseType", {
    is: "fixed-course",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),

  fixedDays: Joi.array()
    .items(
      Joi.string().valid(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      )
    )
    .when("courseType", {
      is: "fixed-course",
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),

  fixedStartTime: Joi.string().pattern(timePattern).when("courseType", {
    is: "fixed-course",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),

  fixedEndTime: Joi.string().pattern(timePattern).when("courseType", {
    is: "fixed-course",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
});


module.exports = {
  createServiceSchema,
};
