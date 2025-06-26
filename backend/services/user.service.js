const passwordChangeLogModel = require("../models/passwordChangeLogModel");
const UserModel = require("../models/user.model");

const getUserById = async(id)=>{
    return await UserModel.findById(id);
};

const updateUser = async(id,data)=>{
    return await UserModel.findByIdAndUpdate(id,data,{new:true})
};

const updateUserPhoto = async(id,photoUrl)=>{
    return await UserModel.findByIdAndUpdate(id,{photoUrl},{new:true})
};

const updateUserProfile = async(id,profileData)=>{
    return await UserModel.findByIdAndUpdate(
        id,
        {profile:profileData},
        {new:true}
    );
};

const createOtpDoc= async(resetData)=>{
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 min
return await passwordChangeLogModel.create({
    userId: resetData.userId,
    method: "reset",
    otp: resetData.otp,
    tokenUsed: resetData.tokenUsed,
    ip: resetData.ip,
    userAgent: resetData.userAgent,
    expiredAt: expiresAt


})

}
const findUserByEmail = async (email) => {
    console.log("userService: ", email);
    
    return await UserModel.findOne({ email });
  };

  const updatePasswordByEmail = async (email, newPassword) => {
    const user = await UserModel.findOne({ email }).select('+password');
  
    if (!user) throw new Error("User not found");
  
    user.password = newPassword; // this will trigger pre-save
    return await user.save();    
  };

  const updateResetEntry = async (token) => {
    return await passwordChangeLogModel.findOneAndUpdate(
      { tokenUsed: token }, 
      { used: true },       
      { new: true }         
    );
  };

  const updateExpiredTime= async(token,newotp)=>{
    console.log("new otp: ",newotp);
    
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
    return await passwordChangeLogModel.findOneAndUpdate({tokenUsed: token}, {expiredAt: expiresAt, otp: newotp } ,{new: true})
  }
  
module.exports = {
    getUserById,
    updateUser,
    updateUserPhoto,
    updateUserProfile,
    findUserByEmail,
    createOtpDoc,
    updatePasswordByEmail,
    updateResetEntry,
    updateExpiredTime

}