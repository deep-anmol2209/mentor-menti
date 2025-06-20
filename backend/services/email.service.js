const path = require("path");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const config = require("../config");
const transport = nodemailer.createTransport(config.email);
transport
  .verify()
  .then(() => console.log("Connected to email server"))
  .catch(() => {
    console.error("Unable to connect to email server.");
  });

const sendEmail = async (to, subject, html) => {
  try {
    const msg = { from: config.email.from, to, subject, html };
    await transport.sendMail(msg);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendConfirmationMail = async (to, name,status, meetingLink, date , time) => {
  const subject = "Booking Confirmation";

  // Dynamically select template based on status
  let template ;

  if (status === "confirmed") {
     template = path.join(__dirname, `../template/confirmation.ejs` );
  } else if (status === "rescheduled") {
     template = path.join(__dirname, `../template/rescheduled.ejs` );
  }

  

  const data = await ejs.renderFile(template, {
    name,
    meetingLink,
    date,
    time,
    status, // optional: if you want to use in the template
  });

  return sendEmail(to, subject, data);
};

const sendRescheduleRequestMail = async (to, name, bookingPageUrl) => {
  const subject = "Reschedule Request";

  const template = path.join(__dirname, "../template/rescheduleRequest.ejs");
  const data = await ejs.renderFile(template, {
    name,
    bookingPageUrl
  });

  return sendEmail(to, subject, data);
};


module.exports = {
  sendConfirmationMail,
  sendRescheduleRequestMail
};
