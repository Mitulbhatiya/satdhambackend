const mongoose = require("mongoose");

/** sanskar mandir schema */
const sanskarSchema = mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
        },
        isBanner: {
            type: Boolean,
            required: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("sanskarMandir", sanskarSchema);

