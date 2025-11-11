const mongoose = require("mongoose");

/** token schema */
const tokenSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "onModel"
        },
        onModel: {
            type: String,
            required: true,
            enum: ["admin", "user"]
        },
        token: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("token", tokenSchema);

