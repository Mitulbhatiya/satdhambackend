const mongoose = require("mongoose");

/** admin schema */
const adminSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        adminid: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            required: true,
            enum: [true, false]
        },
        type: {
            type: String,
            required: true,
            enum: ["main", "sub"]
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("admin", adminSchema);

