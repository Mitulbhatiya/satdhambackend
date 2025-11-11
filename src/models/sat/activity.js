const mongoose = require("mongoose");

/** Activity schema */
const activitySchema = mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("activity", activitySchema);

