const express = require('express')
require('dotenv').config()
const path=require('path')
const file_uploader = require('express-fileupload')
app=express()
app.use(express.json())
cloudinary=require('cloudinary')
cloudinary.config({
  cloud_name:process.env.cloud_name,
  api_key:process.env.api_key,
  api_secret:process.env.api_secret,
  secure:true
})
app.use(file_uploader( 
  {useTempFiles:true}
))
//Limit the file
/* app.use(file_upload({
    limits: { fileSize: 50 * 1024 * 1024 }, //Bytes
  })); */
app.post('/upload',async(req,res)=>{
//check any file uploaded or not
if(!req.files){
    res.status(400)
    res.send("Upload A File!")
    return
}
var samplefile=req.files.file  //fetch a file with name 'file'
var  extension=path.extname(samplefile.name).toLocaleLowerCase(); //return .jpeg /.png ,etc
console.log(extension)
//Check file extensions
if(extension!='.jpeg'&& extension!='.jpg'&& extension!='.png'){
    res.status(400)
    res.send("Upload A image File!")
    return
}
else{
    var result =await cloudinary.uploader.upload(samplefile.tempFilePath)
    .catch(err=>{console.log(err)})
      res.status(200).json({
      Result:result
     })
    }
})
//Fetch image from cloudinary
app.get('/show',async(req,res)=>{
  const result=await cloudinary.image('https://res.cloudinary.com/testmongo/image/upload/v1641538466/mzgbpqhj3llqsh2809q5.png',{type:'fetch'}) //pass secure_url
  res.json({profile:result})
})
//Deletion file from cloudinary
app.delete('/delete',async(req,res)=>{
  try{
 await cloudinary.uploader.destroy('mzgbpqhj3llqsh2809q5') //pass public_id
 res.send('File Deleted')
  }
  catch(error){
      res.send(error)
  }
})
app.listen(3000,()=>{
    console.log("Server is Active")
})