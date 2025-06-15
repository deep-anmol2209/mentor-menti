const razorpay = require("razorpay");
const config = require("../config");
const httpStatus = require("../util/httpStatus");
const bookingService = require("../services/booking.service");
const zoomService = require("../services/zoom.service");
const emailService = require("../services/email.service");
const moment = require("moment");
const handleRazorpayWebhook = async (req, res, next) => {
  console.log('hello');
  
  const { event } = req.body;
  console.log(event);
  
  if (event === "order.paid") {
    const bookingId = req.body.payload.payment.entity.notes.bookingId;
    const booking = await bookingService.getBookingById(bookingId);
    console.log(booking);
    console.log(booking.bookingDate);
    
    
    const zoomMeeting = await zoomService.createScheduledZoomMeeting(
      booking.bookingDate,
      booking.duration,
      booking.startTime
    );

    await bookingService.updateBookingById(bookingId, {
      meetingLink: zoomMeeting,
      status: "confirmed",
    });

    await emailService.sendConfirmationMail(
      booking.user.email,
      booking.user.name,
      zoomMeeting,
      moment(booking.dateAndTime).format("DD-MM-YYYY"),
      moment(booking.dateAndTime).format("HH:mm")
    );
  }
  return res.status(httpStatus.ok).json({
    message: "Webhook received",
  });
};

module.exports = {
  handleRazorpayWebhook,
};
