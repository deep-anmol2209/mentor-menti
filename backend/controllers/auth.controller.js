const authService = require("../services/auth.service");
const httpStatus = require("../util/httpStatus");
const tokenService = require("../services/token.service")
const generateOtp = require('../helper/generateOtp');
const getClientInfo = require("../helper/getClientInfo")
const userService = require("../services/user.service");
const passwordChangeLog = require("../models/passwordChangeLogModel")
const emailService = require("../services/email.service");
const config = require("../config");
const jwt = require('jsonwebtoken');
const { date } = require("joi");


const signUp = async (req, res) => {
    const { name, email, password, username, role } = req.body;

    const user = await authService.createUser({
        name,
        email,
        username,
        password,
        role
    });
    user.password = undefined;
    return res.status(httpStatus.created).json({
        message: "Account created successfully",
        user,
    });
}

const signIn = async (req, res) => {
    const { email, password } = req.body;
    console.log(getClientInfo(req));
    
    const user = await authService.loginUserWithEmailAndPassword(email, password);

    const token = await tokenService.generateAuthTokens(user);
    user.password = undefined;
    res.status(httpStatus.ok).json({
        message: "User signed in successfully",
        token,
        user
    })
}

const sendResetOtp = async (req, res) => {
    try {
        console.log(req.body);
        
        const { email, token } = req.body;
console.log(email, token);

        // 1. Check user exists
        const user = await userService.findUserByEmail(email);
        console.log("user: ", user);
        
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // 2. Generate OTP
        const otp = generateOtp(4);

        if(token){
            const resetEntry= await userService.updateExpiredTime(token, otp);
            console.log("resend otp: ", resetEntry);
                 
        }
        const Verificationtoken = await tokenService.generateVerificationToken(user._id)

        if (!otp) {
            return res.status(httpStatus.internalServerError).json({ success: false, message: "otp not gene" })
        }

        const { ip, userAgent } = await getClientInfo(req)

        const chnagepassword = await userService.createOtpDoc({ userId: user._id, method: "reset", tokenUsed: Verificationtoken, ip: ip, userAgent: userAgent, otp: otp })

        if (!chnagepassword) {
            return res.status(httpStatus.internalServerError).json({
                success: false,
                message: "otp doc not created"
            })
        }
        await emailService.resetPasswordtMail(user.name, user.email, otp, Verificationtoken)



        return res.json({ message: "OTP sent to your email", token: Verificationtoken });
    } catch (err) {
        console.error("Error sending reset OTP:", err);
        return res.status(500).json({ message: "Something went wrong" });
    }
};


const verifyOtpController = async (req, res) => {
    try {
        const { otp, token } = req.body;
        console.log(otp);
        console.log(token);


        if (!otp || !token) {
            return res.status(400).json({ message: "OTP and token are required." });
        }

        const resetEntry = await authService.findOtpDocByToken(token);
        console.log(resetEntry);

        if (!resetEntry) {
            return res.status(400).json({ message: "Invalid or expired reset link." });
        }

        if (resetEntry.used) {
            return res.status(400).json({ message: "This reset link has already been used." });
        }

        if (resetEntry.expiredAt < Date.now()) {
            return res.status(httpStatus.badRequest).json({
                success: false,
                message: "OTP expired try again with another otp"
            })
        }

        if (resetEntry.otp !== otp) {
            console.log(resetEntry.otp);
            console.log(otp);


            return res.status(400).json({ message: "Incorrect OTP. Please try again." });
        }

        // ✅ OTP verified successfully
        return res.status(200).json({
            message: "OTP verified. You may now reset your password.",
            token // send back so frontend can use it in final change-password request
        });
    } catch (err) {
        console.error("Error verifying OTP:", err);
        return res.status(500).json({ message: "Server error while verifying OTP." });
    }
};

const updatePassword = async (req, res) => {
    try{
    const { email, newPassword, token } = req.body

    if (!email || !newPassword || !token) {
        return res.status(httpStatus.badRequest).json({
            success: false,
            message: "missing required feilds"
        })
    }

    const user = await userService.findUserByEmail(email);
    if (!user) {
        return res.status(httpStatus.badRequest).json({
            success: false,
            message: "user does not exist"
        })
    }

    const resetEntry = await authService.findOtpDocByToken(token);
    console.log(resetEntry);
    if (!resetEntry) {
        return res.status(400).json({ message: "Invalid or expired reset link." });
    }

    if (resetEntry.expiredAt < Date.now()) {
        return res.status(httpStatus.badRequest).json({
            success: false,
            message: "OTP expired try again with another otp"
        })
    }

    const upadtePassword= await userService.updatePasswordByEmail(email, newPassword)
    if(!upadtePassword){
        return res.status(httpStatus.badRequest).json({success: false,
            message: "password updation failed"
        })
    }

    const updateResetEntry= await userService.updateResetEntry(token);
    if(!updateResetEntry){
        return res.status(httpStatus.badRequest).json({success: false,
            message:"reset entry status ot updated"
        })
    }

    return res.status(httpStatus.ok).json({success: true,
        message: "password updated successfully"
    })
    }catch(error){
        console.log(error);
        
  return res.status(httpStatus.internalServerError).json({message: error.message})
    }
}

module.exports = { signIn, signUp, sendResetOtp, verifyOtpController, updatePassword };