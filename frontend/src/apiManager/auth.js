import AxiosInstances from "./index";

const signin=(data)=>{
    return AxiosInstances.post("/auth/signin", data);
}

const signup = (data) =>{
    return AxiosInstances.post("/auth/signup",data);
}

export default {signin, signup};