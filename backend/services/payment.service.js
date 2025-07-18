const PaymentModel = require("../models/payment.model");
const mongoose= require("mongoose")
const createPayment = async(booking, transactionId) => {
    console.log("bbokingId: ", booking);
    console.log("razorpayId: ", transactionId);
    
    
    return await PaymentModel.create({
        booking: booking,
        transactionId
    })
};

const getPaymentsByMentorId = async (mentorId) => {
    try {
console.log(mentorId.toString());

        const payments = await PaymentModel.find()
        .populate({
          path: "booking",
          populate: [
            { path: "user" },
            { path: "service" }
          ]
        });
      console.log(payments);
      
        // Filter out payments where booking is null (didn't match the mentorId)
        const filteredPayments = payments.filter(payment => payment.booking !== null && payment.booking.mentor.toString()=== mentorId.toString()  );
        
        console.log(filteredPayments);
        return filteredPayments;
    } catch (error) {
        console.error("Error fetching payments by mentor ID:", error);
        throw error;
    }
};
  
  
module.exports= {createPayment, getPaymentsByMentorId}