const Joi = require('joi');

const newRemark_joi = Joi.object({
    note: Joi.string().required(),
    SATID: Joi.string().required(),
    zone: Joi.string().required(),
    attendance: Joi.string().required(),
    createdBy: Joi.string().required(),
});


const updateRemark_joi = Joi.object({
    _id: Joi.string().required(),
    note: Joi.string().required(),
    SATID: Joi.string().required(),
});

const getAndDeleteRemark_joi = Joi.object({
    _id: Joi.string().required(),
});

module.exports = { newRemark_joi, updateRemark_joi, getAndDeleteRemark_joi }