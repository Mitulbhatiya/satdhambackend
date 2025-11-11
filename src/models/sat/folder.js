const mongoose = require("mongoose");

/** Folder schema */
const folderSchema = mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
        },
        title: {
            type: String,
        },
        thumbnail: {
            type: String,
        },
        month: {
            type: String,
        },
        year: {
            type: String,
        },
        bannerImg1: {
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

module.exports = mongoose.model("folder", folderSchema);

