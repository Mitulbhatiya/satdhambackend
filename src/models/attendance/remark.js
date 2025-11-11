const mongoose = require("mongoose");

/** attendance schema */
const takeRemark = mongoose.Schema(
    {
        SATID: {
            type: String,
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        zone: {
            type: String,
            required: true,
        },
        note: {
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
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("atRemark", takeRemark);

