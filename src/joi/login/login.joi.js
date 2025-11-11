const Joi = require('joi');

const adminSchema_joi = Joi.object({
    adminid: Joi.string().required(),
    password: Joi.string().required().pattern(/^[A-Za-z0-9@#!._]+$/)
});

const userSchema_joi = Joi.object({
    id: Joi.string().required(),
    password: Joi.string().required().pattern(/^[A-Za-z0-9@#!._]+$/)
});
module.exports = { adminSchema_joi, userSchema_joi }