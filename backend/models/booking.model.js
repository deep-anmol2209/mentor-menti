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
    },
  
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expireAt: {
      type: Date,
      default: null, // Only set this if status is 'pending'
    },
}
);
bookingSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

bookingSchema.pre('save', function (next) {
  if (this.status === 'pending') {
    this.expireAt = new Date(Date.now() +  60 * 1000); // 30 minutes from now
  } else {
    this.expireAt = undefined; // Will not be deleted by TTL
  }
  next();
});

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;