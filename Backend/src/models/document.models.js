import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const documentSchema = new Schema(
    {
        collectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection",
            required: true
        },

        data: {
            type: Schema.Types.Mixed,
            required: true
        }
    },
    {
        timestamps: true
    }
);

documentSchema.pre("save", async function () {
    if (!this.data?.password ||!this.isModified("data.password")
    ) {
        return;
    }
    this.data.password = await bcrypt.hash( this.data.password, 10);
});

documentSchema.methods.comparePassword = async function (password) {
    if (!password || !this.data?.password) {
        return false;
    }

    return await bcrypt.compare(password,this.data.password);
};

documentSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            collectionId: this.collectionId,
            email: this.data.email,
            username: this.data.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

documentSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            collectionId: this.collectionId
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const Document = mongoose.model( "Document", documentSchema);
