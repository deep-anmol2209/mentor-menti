const UserModel = require("../models/user.model");
const ServiceModel = require("../models/service.model");

const getAllMentors = async(skip,limit)=>{
    
    return await UserModel.find({ role: "mentor" })
    .skip(skip)
    .limit(limit)
    .select("-password");
};

const getMentors = async()=>{
    return await UserModel.find({ role: "mentor" });
    
};

const getMentorsCount = async()=>{
    return await UserModel.countDocuments({ role: "mentor" });
}

const getMentorById =async(id)=>{
    return await UserModel.findOne({_id:id,role:"mentor"});
};

const getMentorSuggestions= async(query) =>{

    const suggestion = await UserModel.find({
        role: "mentor",
        $or:[
        {name: { $regex: query, $options: 'i' }}, 
        {username:{$regex: query, $options: 'i'}},
        {"profile.tags": { $regex: query, $options: 'i' }}, 
        {"profile.title": { $regex: query, $options: 'i' }}, 
        ]
    }).select("name email photoUrl profile username"); 


    return suggestion;
}

const getMentorByUsername= async(username) =>{

    const mentor = await UserModel.findOne({
        role: "mentor",
        username: username
    }).select("name email photoUrl profile username");

    return mentor;
}

const getMentorServices = async (id) => {
    return await ServiceModel.find({ mentor: id, active: true });
  };


module.exports = {
    getAllMentors,
    getMentorById,
    getMentorByUsername,
    getMentorsCount,
    getMentors,
    getMentorServices,
    getMentorSuggestions
}