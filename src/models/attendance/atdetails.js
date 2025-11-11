const mongoose = require("mongoose");

/** attendance schema */
const takeAttendance = mongoose.Schema(
    {
        isPresent: {
            type: Boolean,
            required: true,
            enum: [true, false]
        },
        SATID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "user"
        },
        zone: {
            type: String,
            required: true,
        },
        attendance: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "attendance"
        },
        isActive: {
            type: Boolean,
            required: true,
            enum: [true, false]
        },
        date: {
            type: Date,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("atdetails", takeAttendance);

