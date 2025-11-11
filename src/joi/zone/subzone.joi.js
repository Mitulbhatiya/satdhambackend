const Joi = require('joi');

const createSubZone_joi = Joi.object({
    ID: Joi.string().required(),
    zoneID: Joi.string().required(),
});

const updateSubZone_joi = Joi.object({
    _id: Joi.string().required(),
    ID: Joi.string().required(),
    zoneID: Joi.string().required(),
    oldSubzone: Joi.string().required(),
});

module.exports = { createSubZone_joi, updateSubZone_joi }
