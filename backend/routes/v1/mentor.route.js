const express = require('express');
const mentorController = require('../../controllers/mentor.controller');
const asyncHandler = require("../../helper/asyncHandler");

const router = express.Router();

router.get("/",asyncHandler(mentorController.getAllMentors))
router.get("/top-mentors",asyncHandler(mentorController.getTopMentors))
router.get("/profile/:username",asyncHandler(mentorController.getMentorProfile))

router.get('/:username',asyncHandler(mentorController.getMentorInfoByUsername));

module.exports=router;