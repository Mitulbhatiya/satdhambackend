const Joi = require('joi');

const role_subuser_joi = Joi.object({
    id: Joi.string().required(),
    user: Joi.array().required(),
    type: Joi.string().required(),
});

const role_attendance_joi = Joi.object({
    userId: Joi.string().required(),
    attendanceAccess: Joi.boolean().required(),
});
module.exports = { role_subuser_joi, role_attendance_joi }