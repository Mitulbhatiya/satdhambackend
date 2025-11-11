const mongoose = require("mongoose");

/** Zone schema */
const zoneSchema = mongoose.Schema(
    {
        ID: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "location",
            required: true,
        },
        admin: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true
            }
        ],
        subadmin: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true
            }
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("zone", zoneSchema);

