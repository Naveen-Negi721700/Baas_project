import mongoose, { Schema } from "mongoose";

const apiKeySchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        keyId: {
            type: String,
            required: true,
            unique: true,
        },
        key: {
            type: String,
            required: true,
            unique: true,
        },
        type: {
            type: String,
            enum: ["public", "secret"],
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const ApiKey = mongoose.model("ApiKey", apiKeySchema);