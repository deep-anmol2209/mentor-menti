const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
const {getZoomAccessToken} =require('../services/zoom.service')

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const createOrder = async (req, res) => {
  try {
    const { amount, currency, name, description, bookingId} = req.body;

    if (!amount || !currency || !name || !description) {
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

      res.status(200).send({
        success: true,
        msg: "Order Created",
        order_id: order.id,
        amount: amountInPaise,
        key_id: process.env.RAZORPAY_KEY_ID,
        product_name: name,
        description,
        contact: "9999999999",
        name: "Avtar singh",
        email: "officialavtar13@gmail.com",
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error.message);
    res.status(500).send({ success: false, msg: "Server Error" });
  }
};

// controllers/payment.controller.js




const verifyPayment = (req,res) => {
  const {razorpay_order_id, razorpay_signature, razorpay_payment_id }= req.body
  // const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", razorpayInstance.key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, msg: "transaction is not legit" });
  } 

  res.status(200).json({success: true, order_id: razorpay_order_id, paymentId: razorpay_payment_id})

};



module.exports = { createOrder, verifyPayment };
