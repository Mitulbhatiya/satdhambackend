const mongoose = require("mongoose");

/** Whatsapp QR img schema */
const whQrSchema = mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("whqr", whQrSchema);

