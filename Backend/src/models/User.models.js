import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true                         // it will create index for username field in database for faster search
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        avatar: {
            type: String,
            required: true
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan"
        }
    },
    {
        timestamps: true
    }
);

export const User = mongoose.model("User", userSchema);