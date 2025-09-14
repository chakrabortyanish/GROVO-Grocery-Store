import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        set: v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
    },
    lastName : {
        type : String,
        set: v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
    },
    email : {
        type : String,
        required : true,
        unique: true
    },
    password : {
        type : String,
        required : true
    }
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);