const mongoose = require("mongoose");

/** Upload Samajik seva schema */
const UploadSchema = mongoose.Schema(
    {
        folderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "foldersamajikseva"
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

module.exports = mongoose.model("samajiksevaupload", UploadSchema);

