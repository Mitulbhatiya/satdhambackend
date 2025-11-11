const mongoose = require("mongoose");

/** admin schema */
const userSchema = mongoose.Schema(
    {
        ID: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
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
        locality: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "location"
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
            required: true,
        },
        profilePhotoStatus: {
            type: Boolean,
            required: true,
            enum: [true, false]
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
        linked: {
            type: Boolean,
            required: true,
            enum: [true, false]
        },
        role: {
            type: String,
            required: true,
            enum: ["user", "zoneadmin", "admin"]
        },
        attendancePermission: {
            type: Boolean,
            required: true,
            enum: [true, false]
        },

        attendance: {
            type: Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            required: true,
            enum: [true, false]
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("user", userSchema);

