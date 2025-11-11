const mongoose = require("mongoose");

/** gaushala schema */
const gaushalaSchema = mongoose.Schema(
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

module.exports = mongoose.model("gaushala", gaushalaSchema);

