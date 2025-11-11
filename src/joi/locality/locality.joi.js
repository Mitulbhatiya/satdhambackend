const Joi = require('joi');

const newLocation_joi = Joi.object({
    state: Joi.string().required().pattern(/^[A-Z-_\s]+$/),
    country: Joi.string().required().pattern(/^[A-Z0-9-_\s]+$/),
    city: Joi.string().required().pattern(/^[A-Z0-9-_\s]+$/),
});


const updateLocation_joi = Joi.object({
    _id: Joi.string().required(),
    state: Joi.string().required().pattern(/^[A-Z-_\s]+$/),
    country: Joi.string().required().pattern(/^[A-Z0-9-_\s]+$/),
    city: Joi.string().required().pattern(/^[A-Z0-9-_\s]+$/),
});


module.exports = { newLocation_joi, updateLocation_joi }