const ContactUSSAT = require("../../../models/sat/satContactus")
const Joi = require('joi')
// Create

const postContactUS = async (req, res, next) => {
    // Define the schema
    const schema = Joi.object({
        type: Joi.string().valid('Donetion', 'Contactus', 'Publication', 'Query').required(), // replace with your actual options
        name: Joi.string().required(),
        mobile: Joi.number().required(),
        email: Joi.string().email().required(),
        message: Joi.string().required()
    });

    // Validate the request body against the schema
    const { error, value } = schema.validate(req.body);

    if (error) {
        // If validation fails, respond with an error
        return res.status(400).json({
            message: "Validation error",
            error: error.details[0].message
        });
    }

    try {
        const contact = new ContactUSSAT(value); // Use the validated value
        const contactUs = await contact.save();
        res.status(200).json({
            message: "Contact us saved successfully 😊",
            result: contactUs
        });
    } catch (err) {
        res.status(500).json({
            message: "Error on create!",
            err: err.message
        });
    }
}


const getAllContactUs = async (req, res, next) => {
    try {
        const contacts = await ContactUSSAT.find();
        res.status(200).json({
            message: "Contact messages fetched successfully 😊",
            result: contacts
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching contact messages!",
            err: err.message
        });
    }
}


// GEt

const getContactUSByType = async (req, res, next) => {
    try {
        const type = req.query.type;
        const contactus = await DailyDarshan.find({ type: String(type) })
        res.status(200).json({
            message: "Get successfully 😊",
            result: contactus
        })
    } catch (err) {
        res.status(301).json({
            message: "Error on create!",
            err: err
        })
    }
}


module.exports = { postContactUS, getAllContactUs, getContactUSByType }