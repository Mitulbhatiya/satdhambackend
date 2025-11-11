const Joi = require('joi');

const newAttendance_joi = Joi.object({
    description: Joi.string().required().pattern(/^[a-zA-Z0-9@=*._-\s]+$/i),
    zone: Joi.string().required(),
    date: Joi.date().required(),
    createdBy: Joi.string().required(),
});


const patchAttendance_joi = Joi.object({
    _id: Joi.string().required(),
    description: Joi.string().required().pattern(/^[a-zA-Z0-9@=*._-\s]+$/i),
    zone: Joi.string().required(),
    date: Joi.date().required(),
    createdBy: Joi.string().required(),
});

const deleteAttendance_joi = Joi.object({
    _id: Joi.string().required(),
});

const patchAttendanceDetails_joi = Joi.object({
    type: Joi.string().required(),
    attendance: Joi.string().required(),
    zone: Joi.string().required(),
    presentID: Joi.array().required(),
    absentID: Joi.array().required(),
    date: Joi.date().required(),
});

module.exports = { newAttendance_joi, patchAttendance_joi, deleteAttendance_joi, patchAttendanceDetails_joi }