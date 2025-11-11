const mongoose = require("mongoose");

/** admin schema */
const reqSchema = mongoose.Schema(
    {
        requestType: {
            type: String,
            required: true,
        },
        requestStatus: {
            type: String,
            required: true,
        },
        RID: {
            type: String,
            required: true,
        },
        UID: {
            type: String,
        },
        firstname: {
            type: String,
            required: true,
        },
        middlename: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        taluka: {
            type: String,
            required: true,
        },
        village: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
            required: true,
        },

        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female"]
        },
        address: {
            type: String,
            required: true,
        },
        birthdate: {
            type: Date,
            required: true,
        },
        profileurl: {
            type: String,
        },
        zone: {
            type: String,
            required: true,
        },
        subzone: {
            type: String,
            required: true,
        },
        vistar: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            required: true,
            enum: [true, false]
        },
        note: {
            type: String,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("request", reqSchema);

