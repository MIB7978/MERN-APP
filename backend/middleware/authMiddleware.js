const jwt = require("jsonwebtoken");
const User = require("../models/userModel")
const asynchandler = require("express-async-handler");
require('dotenv').config({ path: ".env" });

const protect = asynchandler(async (req,res,next)=>{
    let token ;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    )
    {
        try{
            token = req.headers.authorization.split(" ")[1];

            const decode = jwt.verify(token,process.env.JWT_SECRET)
            req.user = await User.findById(decode.id).select("-password")
            next()
        }
        catch(error)
        {
            res.status(401)
            throw new Error("Not authorized")

        }

    }

    if(!token)
    {
       res.status(401)
       throw new Error("no token") ;
    }

})

module.exports = {protect}