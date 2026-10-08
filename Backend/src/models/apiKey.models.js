import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

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


apiKeySchema.pre("save", async function () {
    if (!this.isModified("key") || !this.key) {
        return;
    }
    this.key = await bcrypt.hash(this.key, 10);
});

apiKeySchema.methods.compareApiKey = async function (apiKeyValue) {

    if (!apiKeyValue) { return false;}
    return await bcrypt.compare(
        apiKeyValue,
        this.key
    );
};


export const ApiKey = mongoose.model("ApiKey",apiKeySchema);