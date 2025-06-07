const { required } = require("joi");
const { Schema, model } = require("mongoose");

const TimeSlotSchema = new Schema({
  startTime: {
    type: String,
    required: true, // or false if optional
  },
  endTime: {
    type: String,
    required: true,
  },
});

const DateBasedAvailabilitySchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  timeSlots: [TimeSlotSchema],
});


const serviceSchema = new Schema(
  {
    mentor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true,
    },
    serviceName: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    duration: {
      type: Schema.Types.Number,
      required: true,
      trim: true,
    },
    courseType: {
      type: Schema.Types.String,
      enum: ["one-on-one", "fixed-course"],
    },
    price: {
      type: Schema.Types.Number,
      required: true,
      trim: true,
    },
    active: {
      type: Schema.Types.Boolean,
      default: true,
    },
    // === For one-on-one sessions ===
    availability: [DateBasedAvailabilitySchema],

    // === For fixed courses ===
    fromDate: Date,
    toDate: Date,
    fixedDays: [String],
    fixedStartTime: String,
    fixedEndTime: String,
  },
  { timestamps: true }
);

const ServiceModel = model("Service", serviceSchema);

module.exports = ServiceModel;
