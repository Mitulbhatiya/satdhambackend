const mongoose = require("mongoose");

/** admin schema */
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        password: {
            type: String,
        },
        mobile: {
            type: String,
        },
        gender: {
            type: String,
            enum: ["Male", "Female"]
        },
        address: {
            type: String,
        },

        district: {
            type: String,
        },
        taluka: {
            type: String,
        },
        village: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },

        image: {
            type: String,
        },
        age: {
            type: String,
        },
        birthdate: {
            type: Date,
        },
        business: {
            type: String,
        },
        note: {
            type: String,
        },
        other: {
            type: String,
        },
        isActive: {
            type: Boolean,
            enum: [true, false]
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("satshriuser", userSchema);

