const express = require('express');
const authController = require('../../controllers/auth.controller');
const validate = require('../../middleware/validate');
const asyncHandler = require('../../helper/asyncHandler');

const {signUpValidation,signInValidation} =require('../../validations/auth.validation');
const router = express.Router();

router.post("/signup",validate(signUpValidation),asyncHandler(authController.signUp));
router.post("/signin",validate(signInValidation),asyncHandler(authController.signIn));
router.post("/reset-password", asyncHandler(authController.sendResetOtp))
router.post("/verify-otp", asyncHandler(authController.verifyOtpController))
router.post("/update-password", asyncHandler(authController.updatePassword))
module.exports = router;