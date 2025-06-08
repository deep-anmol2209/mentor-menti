const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    user: {  // Single user reference for both types
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // For one-on-one sessions
    bookingDate: Date,
    startTime: String,
    endTime: String,
    
    // For fixed courses
    sessionDate: Date,  // The specific date of attendance
    
    price: Number,
    meetingLink: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    serviceType: {
      type: String,
      enum: ['one-on-one', 'fixed-course'],
      required: true
    },
    duration: Number,
    // Additional flag for fixed courses if needed
    isFixedCourseSession: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;