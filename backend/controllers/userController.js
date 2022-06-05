const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary")


//Register a user
exports.userRegister = catchAsyncError(async (req, res, next) => {
    
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });

    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });

    sendToken(user, 201, res);
});


//login user
exports.loginUser = catchAsyncError(async (req, res, next) => {


    const { email, password } = req.body;

    //checking if user has given email and password both
    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    sendToken(user, 200, res);

});


//logout user
exports.logout = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });


    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
});


//Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }

    //get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your pasword reset token is :- \n\n ${resetPasswordUrl}  \n\n If you have not requested this email then please ignore this message.`;


    try {
        await sendEmail({
            email: user.email,
            subject: "MyKart Password Recovery",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});


//Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {

    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or has expired",400));
    }

    if (req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();


    sendToken(user,200,res);
});


//Get user details
exports.getUserDetails = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    });
});


//Update user password
exports.updatePassword = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("old password is incorrect", 400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("password does not match", 400))
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res)
});

//Update user profile
exports.updateProfile = catchAsyncError(async(req,res,next)=>{

   const newUserData = {
       name:req.body.name,
       email:req.body.email
   }

   if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
   
   const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
   });

    res.status(200).json({
        success:true,
        user
    })
});

//Get all users ---> admin
exports.getAllUser = catchAsyncError(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
});

//Get single user ---> admin
exports.getSingleUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler("User does not exist",404));
    }

    res.status(200).json({
        success:true,
        user
    })
});

//Update user role ---> admin
exports.updateRole = catchAsyncError(async(req,res,next)=>{

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    
    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
         new:true,
         runValidators:true,
         useFindAndModify:false
    });

    if(!user){
        return next(new ErrorHandler("User not found",400));
    }
 
     res.status(200).json({
         success:true,
         user
     })
 });

 //Delete user ---> Admin
exports.deleteUser = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler("User not found",400));
    }

    await user.remove();
 
    res.status(200).json({
         success:true,
        message:"User deleted successfully"
     })
 });