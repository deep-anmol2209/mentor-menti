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
console.log("status: ",status);

  if (status === "confirmed") {
    console.log("to: ", to);
    
     template = path.join(__dirname, `../template/confirmation.ejs` );
     console.log("confirmed",template);
  } else if (status === "rescheduled") {
     template = path.join(__dirname, `../template/rescheduled.ejs` );
     console.log("rescheduled",template);
  }

  console.log(template);
  

  const data = await ejs.renderFile(template, {
    name,
    meetingLink,
    date,
    time,
    status, // optional: if you want to use in the template
  });
console.log("data: ", data);

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

const resetPasswordtMail = async (name, to, otp, token) => {
  const subject = "Reset Password Request";

  const templatePath = path.join(__dirname, "../template/resetPassword.ejs");
  const data = await ejs.renderFile(templatePath, { name, otp,to, token });

  return sendEmail(to, subject, data);
};


module.exports = {
  sendConfirmationMail,
  sendRescheduleRequestMail,
  resetPasswordtMail
};
