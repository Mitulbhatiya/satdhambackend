const Joi = require('joi');

const get_each_user_joi = Joi.object({
    id: Joi.string().required(),
});

const update_active_user_status = Joi.object({
    _id: Joi.string().required(),
    isActive: Joi.boolean().required(),
});

module.exports = { get_each_user_joi, update_active_user_status }