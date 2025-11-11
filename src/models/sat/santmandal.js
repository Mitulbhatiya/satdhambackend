const mongoose = require("mongoose");

/** upload schema */
const uploadSchema = mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
        },
        sid: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("santmandal", uploadSchema);

