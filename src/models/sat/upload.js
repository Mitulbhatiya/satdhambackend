const mongoose = require("mongoose");

/** upload schema */
const uploadSchema = mongoose.Schema(
    {
        folderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "folder"
        },
        fileName: {
            type: String,
            required: true,
        },
        link: {
            type: String,
        },
        videologo: {
            type: Boolean,
        },

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("upload", uploadSchema);

