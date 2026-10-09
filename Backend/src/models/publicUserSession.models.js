import mongoose, { Schema } from "mongoose";

const projectUserSessionSchema = new Schema(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true
        },
        collectionId: {
            type: Schema.Types.ObjectId,
            ref: "Collection",
            required: true
        },
        documentUserId: {
            type: Schema.Types.ObjectId,
            ref: "Document",
            required: true
        },

        refreshToken: {
            type: String,
            required: true
        },

        expiresAt: {
            type: Date,
            required: true
        },
        isRevoked: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
     }
);

export const ProjectUserSession = mongoose.model("ProjectUserSession",projectUserSessionSchema);