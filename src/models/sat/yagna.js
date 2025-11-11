const mongoose = require("mongoose");

/** Yagna schema */
const yagnaSchema = mongoose.Schema(
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

module.exports = mongoose.model("yagna", yagnaSchema);

