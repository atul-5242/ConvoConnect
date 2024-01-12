const mongoose = require("mongoose");

const AnswerSchema=new mongoose.Schema({
    nameAuthour:{
        type:String,
        require,
    },
    codeUpload:{
        type:String,
        trim:true,
    }
})

module.exports=mongoose.model("Answer",AnswerSchema);