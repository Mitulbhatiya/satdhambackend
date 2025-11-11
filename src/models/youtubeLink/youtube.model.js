const mongoose = require("mongoose");

/** Youtube Link schema */
const youtubeLinkSchema = mongoose.Schema(
    {
        youtubeLink: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("youtubelink", youtubeLinkSchema);

