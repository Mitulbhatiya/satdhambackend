const mongoose = require("mongoose");

/** Folder schema */
const activityfolderSchema = mongoose.Schema(
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
        location: {
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

module.exports = mongoose.model("folderactivity", activityfolderSchema);

