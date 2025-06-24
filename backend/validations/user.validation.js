const Joi = require("joi");

const updateUserProfileValidation = Joi.object({
    name: Joi.string().optional(),
    tags: Joi.array().items(Joi.string().optional()),
    title: Joi.string().optional(),
    bio: Joi.string().optional(),
    social: Joi.object({
       
        linkedin:Joi.string().allow('', null).optional(),
        github:Joi.string().allow('', null).optional(),
        twitter: Joi.string().allow('', null).optional(),
        facebook:Joi.string().allow('', null).optional(),
        instagram: Joi.string().allow('', null).optional(),
    }).optional(),
    college: Joi.string().optional(),
});


module.exports = {
    updateUserProfileValidation,
}