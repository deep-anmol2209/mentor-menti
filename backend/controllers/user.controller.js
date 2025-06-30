
const cloudinary = require("cloudinary").v2;
const { default: mongoose } = require("mongoose");
const config = require("../config");
const userService = require("../services/user.service");
const httpStatus = require("../util/httpStatus");
const UserModel = require("../models/user.model");


cloudinary.config(config.cloudinary);

const uploadPhoto = async(req,res)=>{
  
    if(!req.file){
        return res.status(400).json({
            messgae:"No file uploaded"
        });
    }

    try {
        const result = await cloudinary.uploader.upload(req.file.path,{
            folder:"user_photos",
            use_filename: true,
        });

        const updatedUser = await userService.updateUserPhoto(
            req.user._id,
            result.secure_url
        );

        if(!updatedUser){
            return res.status(404).json({
                message:"User not found"
            });
        }

        res.status(200).json({
            message:"Photo uploaded successfully",
            PhotoUrl: updatedUser.photoUrl,
        });

    } catch (error) {
        console.error("Error uploading photo: ", error);
        res.status(500).json({
            message:"Error uploading photo"
        });
    }
};

const getUser = async(req,res,next)=>{
    const userId = req.user._id;
    const user = await userService.getUserById(userId);

    if(!user){
        return next(new ApiError(httpStatus.notFound,"User not found"));
    }

    res.status(httpStatus.ok).json({
        success:true,
        user,
    });
};


const updateUserProfile = async(req,res,next)=>{
    const userId = req.user._id;
    const profileData = req.body;

    const updatedUser = await userService.updateUserProfile(userId, profileData);

    if(!updatedUser){
        return next(new ApiError(httpStatus.notFound,"User not found"));
    }

    res.status(httpStatus.ok).json({
        success:true,
        message:"Profile updated successfully",
        user:updatedUser,
    });
};

const changePasswordById= async(req, res, next)=>{
    try{
    const userId= req.user._id

    const {oldPassword, newPassword}= req.body

    if(!oldPassword || !newPassword){
        return res.status(httpStatus.badRequest).json({
            success: false,
            message: "old and new password is required"
        })
    }

    if(!userId || !mongoose.Types.ObjectId.isValid(userId)){
        return res.status(httpStatus.badRequest).json({
            success: false,
            message: "userId is missing or invalid"
        })
    }

    const user= await UserModel.findById(userId).select("+password");
    console.log("user:",user);
    console.log("oldpassword: ", oldPassword);
    
    if(!user || !(await user.isPasswordMatch(oldPassword))){
        
        throw new ApiError(httpStatus.forbidden,"your old password is incorrect");
    }

    const updatePassword= await userService.updatePasswordById(userId,newPassword);

    if(!updatePassword){
       return res.status(httpStatus.internalServerError).json({success: false, 
        message: "error in updating password"
       }) 
    }

    return res.status(httpStatus.ok).json({success: true,
        message: "password updated"
    })
    }catch(error){
        console.log(error);
        
        return res.status(httpStatus.internalServerError).json({
            success: false,
            message: error.message
        })
    }
}

const removePhoto=(req, res , next)=>{
    try{
    const userId = req.user._id;

    if(!userId || !mongoose.Types.ObjectId.isValid(userId)){
        return res.status(httpStatus.badRequest).json({
            success: false,
            message: "userId is missing or invalid"
        })
    }

    const del_photo= userService.deletePhotoById(userId);

    if(!del_photo){
        return res.status(httpStatus.badRequest).json({
            success: false,
            message: "photo not deleted"
        })
    }

    return res.status(httpStatus.ok).json({success: true,
        message: "photo deleted"
    })
}catch(error){
      return res.status(httpStatus.internalServerError).json({
        success: false,
        message: error.message
    })
}
}

module.exports = {
    uploadPhoto,
    getUser,
    updateUserProfile,
    changePasswordById,
    removePhoto
};