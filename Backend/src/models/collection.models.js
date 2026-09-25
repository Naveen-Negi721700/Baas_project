import mongoose, { Schema } from "mongoose";

const collectionSchema = new Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        schema: {
            type: Object,
            required: true,
        },

        isSystem: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Collection = mongoose.model("Collection", collectionSchema);