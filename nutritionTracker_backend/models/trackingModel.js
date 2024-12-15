const mongoose = require("mongoose")


const trackingSchema = mongoose.Schema({
    userId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    foodId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'foods',
        required:true
    },
    eatenDate:{
        type:String,
        default : new Date().toLocaleDateString()
    },
    details:{
        calories:{type:Number,required:true},
        carbohydrates:{type:Number,required:true},
        fat:{type:Number,required:true},
        protien:{type:Number,required:true}
    },
    quantity:{
        type:Number,
        min:1,
        required:true
    },
    quantity_type:{
        type:String,
        required:true
    }
},{timestamps:true})

const trackingModel = mongoose.model('trackings',trackingSchema)

module.exports = trackingModel;