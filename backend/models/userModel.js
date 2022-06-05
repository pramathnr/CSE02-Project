const mongoose = require("mongoose");

const validator = require("validator");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your Name"],
        maxlength:[30,"Name cannot exceed 30 charecters"],
        minlength:[5,"Name should have more than 5 charecters"]
    },
    email:{
        type:String,
        required:[true,"Please enter your Email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please enter your Password"],
        minlength:[8,"Password should be more than 8 charecters"],
        select:false,
    },
    avatar:{
        
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
        
    },
    role:{
        type:String,
        default:"user"
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});

//encrypting user password
userSchema.pre("save",async function(next){

    if( !this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//JWT token
userSchema.methods.getJWTToken = function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRE,
    });
}


//Compare Password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}


//Generating password reset token
userSchema.methods.getResetPasswordToken = function(){

    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hashing and adding to user schema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15*60*1000;   //milliseconds

    return resetToken;
}

module.exports = mongoose.model("User", userSchema);