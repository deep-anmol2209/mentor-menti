const express = require('express');
const asyncHandler = require('../../helper/asyncHandler');
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const chatController= require("../../controllers/chat.controller")



const router = express.Router();

router.post('/send-chat', asyncHandler(chatController.sendAndRecieveMessage))

module.exports=router;