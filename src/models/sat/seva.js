const mongoose = require("mongoose");

/** Seva schema */
const sevaSchema = mongoose.Schema(
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

module.exports = mongoose.model("seva", sevaSchema);

