const mongoose = require("mongoose");

/** contactUs mandir schema */
const contactUsSchema = mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        mobile: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
        },
        message: {
            type: String,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("contactUsSat", contactUsSchema);

