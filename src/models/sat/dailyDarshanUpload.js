const mongoose = require("mongoose");

/** daily darshan schema */
const dailyDarshanSchema = mongoose.Schema(
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

module.exports = mongoose.model("dailydarshan", dailyDarshanSchema);

