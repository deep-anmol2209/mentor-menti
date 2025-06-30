const Razorpay = require("razorpay");
const crypto = require("crypto");

const paymentApi= require("../services/payment.service")
require("dotenv").config();
const {getZoomAccessToken} =require('../services/zoom.service');
const PaymentModel = require("../models/payment.model");
const httpStatus = require("../util/httpStatus");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const createOrder = async (req, res) => {
  try {
    const { amount, currency, name, mentorName, mentorEmail,  description, bookingId} = req.body;

    if (!amount || !currency || !name || !description || !mentorName || !mentorEmail) {
      return res.status(400).send({ success: false, msg: "Missing required fields" });
    }

    const amountInPaise = amount * 100; // Convert to paise

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${new Date().getTime()}`,  // Unique receipt
      notes: {
        description,
        name,
        bookingId
      }
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.error("Razorpay error:", err);
        return res.status(400).send({ success: false, msg: "Something went wrong!" });
      }
 console.log(order);
 
      res.status(200).send({
        success: true,
        msg: "Order Created",
        order_id: order.id,
        amount: amountInPaise,
        key_id: process.env.RAZORPAY_KEY_ID,
        product_name: name,
        description,
        contact: "9999999999",
        name: mentorName,
        email: mentorEmail,
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error.message);
    res.status(500).send({ success: false, msg: "Server Error" });
  }
};

// controllers/payment.controller.js




const verifyPayment =async (req,res) => {
  console.log(req.body);
  console.log(req.params);
  
  const {razorpay_order_id, razorpay_signature, razorpay_payment_id }= req.body
  const bookingId= req.params.id
  console.log("verifyPayment: ",bookingId);
  
  
  // const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", razorpayInstance.key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
console.log(expectedSignature);

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, msg: "transaction is not legit" });
  } 
await paymentApi.createPayment(bookingId, razorpay_payment_id)

 return res.status(httpStatus.ok).json({success: true, order_id: razorpay_order_id, paymentId: razorpay_payment_id})

};

const getPaymentsByMentorId= async(req, res, next)=>{
  console.log(req.user._id);
  
  
  const mentorId= req.user._id

  if(!mentorId){
    return res.status(httpStatus.badRequest).json({
      success: false,
      message: "id is missing"
  })
  }

  const payments= await paymentApi.getPaymentsByMentorId(mentorId)

  if(!payments){
    return res.status(httpStatus.notFound)
  }
  return res.status(httpStatus.ok).json({
    success: true,
    payments
  })
}



module.exports = { createOrder, verifyPayment, getPaymentsByMentorId };
