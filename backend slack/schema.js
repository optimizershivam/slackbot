const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
    name:String,
    email : String,
    attendance:String,
    batch:String,
    course:String,
    image:String,
    marks:Array ,
    id:String  
})

const StudentModel = mongoose.model("student", studentSchema)


module.exports = StudentModel