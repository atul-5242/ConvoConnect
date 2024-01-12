const mongoose = require("mongoose");

const ProfileSchema=new mongoose.Schema({
    
    gender:{
        type:String,
    },
    dataofBirth:{
        type:String,
    },
    about:{
        type:String,
        trim:true,
    },
    contactNumber:{
        type:Number,
        trim:true,
    }
})

module.exports=mongoose.model("Profile",ProfileSchema);

/*
In this case, accountType is a string field, and enum specifies that its value can only be one of the three specified string values: "Admin," "Student," or "Instructor." This means that when you create or update a document in the database with this schema, the accountType field must have one of these three values, or the operation will be rejected.

Using enum is a way to enforce constraints on the possible values that a field can have in your database. It's especially useful when you want to make sure that a field is limited to a predefined set of options and prevent values that don't fit within that set from being stored in the database. This helps maintain data consistency and integrity in your application.
*/ 