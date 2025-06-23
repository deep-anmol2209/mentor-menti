const express = require("express");
const auth = require('../../middleware/auth');
const asyncHandler = require('../../helper/asyncHandler');



const router = express.Router();


const paymentController = require("../../controllers/payment.controller");
const authMiddleware = require("../../middleware/auth");
router.post("/create-order", authMiddleware.protect, paymentController.createOrder);
router.post("/verify-payment/:id", authMiddleware.protect, paymentController.verifyPayment);
router.get("/mentor", authMiddleware.protect,auth.restrictTo('mentor'),  asyncHandler(paymentController.getPaymentsByMentorId) )

module.exports = router;
