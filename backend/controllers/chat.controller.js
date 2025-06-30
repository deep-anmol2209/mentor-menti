const httpStatus = require("../util/httpStatus");
const chatService= require("../services/chat.service")
const sendAndRecieveMessage=async(req, res)=>{
    try{
        console.log(req.body);
        
    const {questionData}= req.body;

    if(!questionData){
        return res.status(httpStatus.badRequest).json({success: false,
            message: "question is missing"
        })
    }

   const data = await chatService.askQuestion(questionData);

   console.log(data);

   return res.status(httpStatus.ok).json({success: true, data})
}catch(error){
    console.log(error);
    
    return res.status(httpStatus.internalServerError).json({success: false,
        message: error.message
    })
}
}

module.exports={
    sendAndRecieveMessage
}