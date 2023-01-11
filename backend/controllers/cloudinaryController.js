require('dotenv').config({ path: ".env" });
const cloudinary = require("cloudinary").v2;

console.log(cloudinary.config().cloud_name)


 
const Cloudinary =   async (req,res)=>{
  // console.log(typeof(req.body.data))
  const {name,data} = req.body
     const uploadURL = await  cloudinary.uploader.upload(data,{
          "public_id": name
      })
      
      console.log(uploadURL.url)
     res.json({"url":uploadURL.url})

}

module.exports = {Cloudinary}