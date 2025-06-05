const express = require('express');
const serviceController = require("../../controllers/service.controller");
const asyncHandler = require("../../helper/asyncHandler");
const validate = require("../../middleware/validate");
const authMiddleware = require("../../middleware/auth");
const {createServiceSchema} = require("../../validations/service.validation");
const router = express.Router();
const cleanServicePayload = require("../../middleware/cleanServicePayload");


router.post("/", validate(createServiceSchema),
authMiddleware.protect,
authMiddleware.restrictTo("mentor"),
asyncHandler(serviceController.createService)
);


router.put("/:serviceId",
    validate(createServiceSchema),
    authMiddleware.protect,
    authMiddleware.restrictTo("mentor"),
    asyncHandler(serviceController.updateService)
    
);

router.get("/id/:serviceId",
    authMiddleware.protect,
    asyncHandler(serviceController.getServiceById)
);

router.get("/:mentorId",
    authMiddleware.protect,authMiddleware.restrictTo("mentor"),
    asyncHandler(serviceController.getServiceByMentor)
);




module.exports = router;
