const express = require("express");
const userController = require("../../controllers/user.controller");
const authMiddleware = require("../../middleware/auth");
const asyncHandler = require("../../helper/asyncHandler");
const validate  = require("../../middleware/validate");
const { updateUserProfileValidation } = require("../../validations/user.validation");
const upload = require("../../middleware/upload");

const router = express.Router();

router.post("/upload-photo",
    authMiddleware.protect,
    upload.single("photo"),
    asyncHandler(userController.uploadPhoto)
)

router.get("/", authMiddleware.protect, asyncHandler(userController.getUser));

router.put("/update-profile",
    authMiddleware.protect,
    validate(updateUserProfileValidation),
    asyncHandler(userController.updateUserProfile)
)

module.exports = router;