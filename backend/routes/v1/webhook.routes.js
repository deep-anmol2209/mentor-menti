const express = require("express");
const router = express.Router();
const webhookController= require('../../controllers/webHookController')
const asyncHandler = require("../../helper/asyncHandler");
router.post("/razorpay", asyncHandler(webhookController.handleRazorpayWebhook));

module.exports = router;
