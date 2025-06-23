const express = require('express');
const asyncHandler = require('../../helper/asyncHandler');
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const bookingController = require('../../controllers/booking.controller');
const {initiateBookingValidation, updateBookingValidation} = require('../../validations/booking.validation');


const router = express.Router();

router.get('/', auth.protect, asyncHandler(bookingController.getBookings));

router.get('/mentor', auth.protect, auth.restrictTo('mentor'), asyncHandler(bookingController.getMentorBookings));

router.post('/initiate-booking', validate(initiateBookingValidation),auth.protect, asyncHandler(bookingController.initiateBookingAndPayment));

router.get('/getBookings/:username', auth.protect, asyncHandler(bookingController.getBookingsByUsername))

router.post('/updateBooking', auth.protect, validate(updateBookingValidation), asyncHandler(bookingController.updateBookingById))

router.post('/checkConflict', auth.protect,  asyncHandler(bookingController.checkTimeConflict));

router.patch('/rescheduleSlot', auth.protect, asyncHandler(bookingController.rescheduleBooking))
router.patch('/cancelBooking', auth.protect, asyncHandler(bookingController.cancelBooking))

module.exports = router;