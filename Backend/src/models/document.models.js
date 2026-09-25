import mongoose, { Schema } from "mongoose";
const documentSchema = new Schema({
    collectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Collection",
        required:true
    },
    data:{
        type:Object,
        required:true
    }
},{timestamps:true})
export const Document=mongoose.model("Document",documentSchema)