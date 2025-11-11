const mongoose = require("mongoose");

/** Sub zone schema */
const subzoneSchema = mongoose.Schema(
    {
        ID: {
            type: String,
            required: true,
        },
        zoneID: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("subzone", subzoneSchema);

