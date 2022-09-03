const express=require("express")
const connection= require("./config")
const StudentModel= require("./schema")

require('dotenv').config()

const app=express()
app.use(express.json())

app.get("/",async(req,res)=>{
    let all=await StudentModel.find()
    return res.send(all)
})

app.post("/student",async(req,res)=>{
    const data=req.body
    const news=new StudentModel(data)
    await news.save()
    return res.send(news)
})



app.listen(process.env.PORT,async()=>{
    try{
        await connection
        console.log("connected to db");
    }
    catch(err){
        console.log(err);
    }
})