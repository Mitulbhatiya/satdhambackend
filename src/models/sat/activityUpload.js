const mongoose = require("mongoose");

/** Activity upload schema */
const activityUploadSchema = mongoose.Schema(
    {
        folderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "folderdailydarshan"
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

module.exports = mongoose.model("activityupload", activityUploadSchema);

