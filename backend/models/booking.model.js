const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: function() { return this.serviceType === 'one-on-one'; }
    },
    users: [{  // For fixed courses
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
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
    courseDates: [Date],  // All session dates
    currentSessionDate: Date,  // The specific date being booked
    
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
    duration: Number
  },
  { timestamps: true }
);

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;