const mongoose = require("mongoose");

/** Yagna schema */
const youtubeLinkThumbnailSchema = mongoose.Schema(
    {
        fileName: {
            type: String,
            // required: true,
        },
        link: {
            type: String,
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

module.exports = mongoose.model("youtubeLinkThumb", youtubeLinkThumbnailSchema);

