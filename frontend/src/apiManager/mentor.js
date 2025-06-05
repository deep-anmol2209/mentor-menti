import AxiosInstances from "./index.js";

const getAllMentors=({ page, limit})=>{
    return AxiosInstances.get("/mentor", {
        params: { page, limit }
    });
}

const getTopMentors=()=>{
    return AxiosInstances.get("/mentor/top-mentors");
}

const getMentorsByUsername = (username) =>{
    return AxiosInstances.get("/mentor/profile/"+username);
}

const getMentorsBySuggestion = (query)=>{
    
    return AxiosInstances.get(`/mentor/suggestions?q=${query}`);
}

// const getMentorById = (username)=>{
//     return AxiosInstances.get("/mentor/"+username);
// }

const mentorApi = {
    getAllMentors,
    getMentorsByUsername,
    getMentorsBySuggestion,
    getTopMentors,
    // getMentorById
}

export default mentorApi;