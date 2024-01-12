const mongoose = require("mongoose");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        trim:true,
    },
    lastName:{
        type:String,
        require:true,
        trim:true,
    },
    email:{
        type:String,
        require:true,
        trim:true,
    },
    password:{
        type:String,
        require:true,
    }, 
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
    },
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"Profile"
    },
    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Courses",
        }
    ],
    image:{
        type:String,
        require:true,
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    image: {
        type: String,
        required: true,
    },
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress",    
        }
    ],
    
})

module.exports=mongoose.model("User",userSchema);

/*
In this case, accountType is a string field, and enum specifies that its value can only be one of the three specified string values: "Admin," "Student," or "Instructor." This means that when you create or update a document in the database with this schema, the accountType field must have one of these three values, or the operation will be rejected.

Using enum is a way to enforce constraints on the possible values that a field can have in your database. It's especially useful when you want to make sure that a field is limited to a predefined set of options and prevent values that don't fit within that set from being stored in the database. This helps maintain data consistency and integrity in your application.
*/ 