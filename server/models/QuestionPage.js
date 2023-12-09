const mongoose = require("mongoose");

const QuestionSchema=new mongoose.Schema({
    questionName:{
        type:String,
        require:true,
    },
    questionLink:{
        type:String,
        trim:true,
    },
    uploadDate:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:String,
        require:true,
    },    
    serialno:{
        type:String,
    }
})

module.exports= mongoose.model("QuestionPage",QuestionSchema);