const Joi = require('joi');

const createZone_joi = Joi.object({
    name: Joi.string().required().pattern(/^[a-zA-Z0-9@=*._-\s]+$/),
    location: Joi.string().required(),
    pincode: Joi.string().required().pattern(/^[0-9]+$/),
});

const updateZone_name_joi = Joi.object({
    name: Joi.string().required().pattern(/^[a-zA-Z0-9@=*._-\s]+$/),
    pincode: Joi.string().required().pattern(/^[0-9]+$/),
    _id: Joi.string().required(),
    type: Joi.string().required(),
});

const updateZone_location_joi = Joi.object({
    location: Joi.string().required(),
    _id: Joi.string().required(),
    type: Joi.string().required(),
});



module.exports = { createZone_joi, updateZone_name_joi, updateZone_location_joi }