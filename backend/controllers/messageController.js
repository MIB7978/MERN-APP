const asynchandler = require("express-async-handler")
const Message = require("../models/messageModel")
const User = require("../models/userModel")
const Chat = require("../models/chatModel")
const sendMessage = asynchandler(async(req,res)=>{

     const {content,chatId} = req.body;

     if(!content || !chatId)
     {
         res.status(404)
         console.log("error")
         throw new Error("invalide data passed in request")
     }

     var newMessage= {
         sender:req.user._id,
         content:content,
         chat:chatId
     }

     try{
     var message = await Message.create(newMessage)
     message = await message.populate("sender","name pic")
     message = await message.populate("chat")
     message = await  User.populate(message,{
         path:"chat.users",
         select:"name pic email"
     })

     await Chat.findByIdAndUpdate(req.body.chatId,{
         latestMessage:message
     })
      res.json(message)
     }catch(error)
     {
         res.json(404)
         throw new Error("internal server error")
     }

})

const allMessage = asynchandler(async(req,res)=>{
      
    try{
       const message = await Message.find({chat:req.params.chatId}) .populate("sender","name pic email").populate("chat")
           res.json(message)
    }
    catch(error){
        console.log(error)
        res.status(404)

        throw new Error("server error")
    }
});

module.exports = {sendMessage,allMessage}