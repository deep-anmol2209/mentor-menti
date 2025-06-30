import AxiosInstances from ".";

const sendChat= async(message)=>{
    return await AxiosInstances.post("/chat/send-chat", {questionData: message})
}

export default{
    sendChat
}