const jwt = require('jsonwebtoken');
const {getUserById} = require("../services/user.service");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");
const {verifyToken}  = require("../services/token.service");

const protect = async(req,res,next)=>{
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
        token = req.headers.authorization.split(" ")[1];
    }
    
    if(!token){
        return next(
            new ApiError(
                httpStatus.unauthorized,
                "You are not logged in! Please Login First"
            )
        )
    }
    
    try {
        console.log("decoding");
        
        const decoded= await verifyToken(token,"accessToken");
        console.log("decoded: ",decoded);
        
        const currentUser = await getUserById(decoded._id);
        
        
        if(!currentUser){
            return next(
                new ApiError(
                    httpStatus.unauthorized,
                    "The user token is no longer exists"
                )
            )
        }

        req.user = currentUser;
        return next();
    } catch (error) {
        console.error("JWT Auth Error:", error); 
       return  next(
            new ApiError(
                httpStatus.unauthorized,'You are not allowed'
            )
        )
        
    }

}

const restrictTo = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
                new ApiError(
                    httpStatus.unauthorized,
                    "You are not allowed"
                )
            )
        }
       
       next();
    }
}

module.exports = {
    protect,restrictTo
}