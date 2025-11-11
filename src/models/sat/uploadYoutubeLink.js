const mongoose = require("mongoose");

/** upload schema */
const uploadSchema = mongoose.Schema(
    {
        folderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "folder"
        },
        link: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("uploadYoutubeLink", uploadSchema);

