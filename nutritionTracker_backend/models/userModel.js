const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    name : {
        type:String,
        required:[true,"name is required"]
    },
    password:{
        type:String,
        required:[true, "password is required"]
    },
    age:{
        type:Number,
        required:[true,"age is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"]
    }
},{timestamps:true})

const userModel = mongoose.model("users",userSchema)

module.exports = userModel;