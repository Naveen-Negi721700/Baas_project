import mongoose, { Schema } from "mongoose";
const userSessionSchema=new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    refreshToken:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true,
    },
},{timestamps:true})

export const UserSessions=mongoose.model("UserSessions",userSessionSchema)