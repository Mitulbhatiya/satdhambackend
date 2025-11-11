const Joi = require('joi');

const updateUserZone_joi = Joi.object({
    users: Joi.array().required(),
    zone: Joi.string().required(),
    subzone: Joi.string().required(),
});


module.exports = { updateUserZone_joi }