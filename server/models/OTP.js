const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema ({
    email:{
        type:String,
        require:true,
    },
    otp:{
        type:String,
        require:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
});

// a function -> to send mail.
async function sendVerificationEmail(email,otp){
    try {
        const mailResponse=await mailSender(email,"Verification Email from StudyNotion",otpTemplate(otp));
        console.log("Email Send Successfully",mailResponse);
        
    } catch (error) {
        console.error("Error Occured While sending he mail.",error);//<- important that type of comments.
        throw error;
    }
}


OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})

module.exports=mongoose.model("OTP",OTPSchema);