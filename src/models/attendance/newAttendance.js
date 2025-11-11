const mongoose = require("mongoose");

/** attendance schema */
const newAttendance = mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        zone: {
            type: String,
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        attendanceTaken: {
            type: Boolean,
            required: true,
            enum: [true, false]
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

module.exports = mongoose.model("attendance", newAttendance);

