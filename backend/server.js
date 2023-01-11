const express = require("express");
const chats = require("./data");
const dotenv = require("dotenv");
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
dotenv.config();
const chatRoutes = require("./routes/chatRoutes")
const app = express();
const messageRoutes = require("./routes/messageRoutes");

app.use(express.json());
const PORT = process.env.PORT || 8080;



app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});
db();
app.use("/api/user", userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);


// app.use(errorHandler);
// app.use(notFound);
const server = app.listen(PORT, () => console.log(`PORT listen on ${PORT}`));
const io = require("socket.io")(server,{
  pingTimeout:60000,
  cors:{
    origin:"http://localhost:3000",
  },
});

io.on("connection",(socket)=>{
  console.log("connected to socket io")
   socket.on('setup',(user)=>{
     socket.join(user._id)
     socket.emit("connected")
   })
   socket.on("join chat",(room)=>{
     socket.join(room)
     console.log("user joined room: "+ room)
   })
   socket.on("typing",(room)=>socket.in(room).emit("typing"))
   socket.on("not typing",(room)=>socket.in(room).emit("stop typing"))
   socket.on("new message",(newMessageReceived)=>{
     var chat = newMessageReceived.chat;
     if(!chat.users) return console.log("chat user not defined")
     chat.users.forEach((user)=>{
       if(user._id===newMessageReceived.sender._id) return;
       socket.in(user._id).emit("message recieved",newMessageReceived)

     })
   })
})
