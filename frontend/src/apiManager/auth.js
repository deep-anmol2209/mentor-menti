import AxiosInstances from "./index";

const signin=(data)=>{
    return AxiosInstances.post("/auth/signin", data);
}

const signup = (data) =>{
    return AxiosInstances.post("/auth/signup",data);
}
const sendOtp= (data)=>{
    console.log("sendOtp: ", data);
    
    return AxiosInstances.post("/auth/reset-password", data)
}

const verifyOtp=(data)=>{
    return AxiosInstances.post("/auth/verify-otp", data)
}

const resetPassword=(data)=>{
    return AxiosInstances.post("/auth/update-password", data)
}
export default {signin, signup, sendOtp, verifyOtp, resetPassword};