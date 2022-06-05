const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:[true,"Please enter your address"]
        },
        city:{
            type:String,
            required:[true,"Please enter your city"]
        },
        state:{
            type:String,
            required:[true,"Please enter your state"]
        },
        country:{
            type:String,
            required:[true,"Please enter your country"]
        },
        pinCode:{
            type:Number,
            required:[true,"Please enter your pin code"]
        },
        phoneNo:{
            type:Number,
            required:[true,"Please enter your phone number"]
        }
    },
    orderItems:[
        {
            name:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            image:{
                type:String,
                required:true
            },
            product:{
                type:mongoose.Schema.ObjectId,
                ref:"Product",
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    paymentInfo:{
        id:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        },
        itemsPrice:{
            type:Number,
            required:true,
            default:0
        },
        taxPrice:{
            type:Number,
            default:0,
            required:true
        },
        shippingPrice:{
            type:Number,
            default:0,
            required:true
        },
        totalPrice:{
            type:Number,
            default:0,
            required:true
        },
    },
    orderStatus:{
        type:String,
        required:true,
        default:"Processing"
    },
    deliveredAt:Date,
    createdAt:{
        type:Date,
        default:Date.now,
    },
    paidAt:{
        type:Date,
        required:true
    }
});


module.exports = mongoose.model("Order", orderSchema);