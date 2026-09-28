import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },


        projectId: {
            type: String,
            required: true,
            unique: true,
        },

        publicKey: {
            type: String,
        },

        secretKey: {
            type: String,
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

export const Project = mongoose.model("Project", projectSchema);