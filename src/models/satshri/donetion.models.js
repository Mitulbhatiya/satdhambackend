const mongoose = require("mongoose");

/** admin schema */
const userSchema = mongoose.Schema(
    {
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "satshriuser"
        },
        donetion: {
            type: Number,
            required: true,
        },
        date: {
            type: Date
        },
        type: {
            type: String,
        },
        note: {
            type: String,
        },
    },

    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("donetion", userSchema);

