import axios from "axios";
import AxiosInstances from "./index";

const uploadImage = async (formData) => {
  return await AxiosInstances.post("/user/upload-photo", formData);
};

const getUser = async () => {
  return await AxiosInstances.get("/user");
};

const updateUser = async (data) => {
  
  return await AxiosInstances.put("/user/update-profile", data);
};

const deletePhoto = async ()=>{
  return await AxiosInstances.patch('/user/remove-photo')
};

const changePassword = async(data) =>{
  return await AxiosInstances.patch('/user/change-password', data)
}
const userAPI = { uploadImage, getUser, updateUser,deletePhoto, changePassword };

export default userAPI;
