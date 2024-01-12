const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const bcrypt=require("bcrypt");
const otpGenerator=require("otp-generator");
const jwt = require("jsonwebtoken");    
require("dotenv").config(); 
// const nodemailer = require('nodemailer'); // You also need the nodemailer library to send email notifications.


// send OTP:-
exports.sendOTP = async (req,res)=>{
    try {
        // fetch email from request ki body
        const {email}=req.body;
        // check if User alredy exits
        const checkUserPresent = await User.findOne({email});

        // if user alredy exist , then return a response.
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User Already exist.",
                val:0,
            });
        }
        // generate OTP:-
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated",otp);

        // <------------------HW here to find a way to generate 
        //otp without using loop 
        // check a unique otp or not:------
        let result=await OTP.findOne({otp:otp});
        console.log("first")
        while(result){
            var otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result=await OTP.findOne({otp:otp});//i my thinking result will store 
            // the value 1 or 0 so it can work on the while loop.
        }
        console.log("Second")
        
        const otpPayload={email,otp};
        // create an entry for otp:-
        const otpBody=await OTP.create(otpPayload);//<-- ess tym pe model of OTP se intraction hua hoga 
        // and tabhi whn par otp sendVerificationEmail() wale function me pre middleware ke
        // through pass ho gya hoga.  <-------------OKEY.
        console.log("Hello:",otpBody);

        // return response Successful
        res.status(200).json({
            success:true,
            message:"OTP sent Successfully.",
            otp,
        })

    } catch (error) {
        console.log("KK:",error);
        return res.status(500).json({
            success:false,
            message:`Error:->${error.message}`,
        })
    }
}

// 29
// SignUp

exports.signUp = async (req,res)=>{     
    try {
        // data entry from the req ki body.
        const {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
        }=req.body;
        console.log("ALL>>>>>>>>>>>>>>>>>>>>",accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp)
        // validation krlo:
        if (!firstName || !lastName || !email || !password || 
            !confirmPassword || !accountType || !otp) {
            return res.status(403).json({
                success:false,
                message:"All fields are required.",
            })
        }
        console.log("P:",password)
        console.log("CP:",confirmPassword)
        // 2 password match krlo
        if (password!==confirmPassword) {
            return res.status(400).json({
                success:false,
                message:"Password and Confirm password does not matched.",
            });
        }
        // check user alredy exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is already registered.",
            });
        }
        // find most recent OTP stored for the user.
         //HW Search this line.
         // Find most recent OTP stored for the user
        const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

        console.log("RecentOTP:---------->",recentOTP);
        // validation OTP:-
        if (recentOTP.length==0) {
            return res.status(400).json({
                success:false,
                message:"OTP found",
            });
        }else if(otp!==recentOTP.otp){
            // Invaild OTP:-
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            });
        }

        // Hashed Password:-
        const hashedPassword=await bcrypt.hash(password,10);

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });

        // entry created in DB:-
        const user = await  User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            // contactNumber,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // return res.
        return res.status(200).json({
            success:true,
            message:"User is registed",
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User can not be registed",
        });
    }
}


// Login
exports.login = async (req,res) =>{
    try {
        // get data from req body
        const {email,password}=req.body;
        // validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required,please try again",
            })
        }
        // user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        // generate  JWT , after password matching
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered,please signup first",
            });
        }

        // generate JWT,after password matching:-
        if (await bcrypt.compare(password,user.password)) {
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const  token =jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",///<-------------------------------------------------------------------------------------------------Search here why only 2h if 2 hours done then what user is logged out?

            });

            user.token=token;
            user.password=undefined;

            // create cookie and send response.
            const options={
                expries:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in Successfully.",
            });
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            })
        }
        // create cookie and send response
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Can Not Logged in , try again.",
        });
    }
}
// ChangePassword

// -------------------------------------HW-------------------------------
// exports.changePassword = async (req,res)=>{
//     // get data from the req ki body
//     // get oldPassword , newPassword , confirmPassword
//     // validation

//     // update Password in DB.
//     // send mail - password
//     // return respose

    
    
    
// }
exports.changePassword = async (req, res) => {
    // ----------------------CHAT GPT CODE ------------------
    try {
      // Get data from the request body
      const { oldPassword, newPassword, confirmPassword } = req.body;
  
      // Validation
      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'New password and confirm password do not match.' });
      }
  
      // You should retrieve the user's current hashed password from the database using their user ID.
      const user = await User.findById(req.user._id); // Assuming you have a User model with a corresponding ID.
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Compare the oldPassword provided with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Old password is incorrect.' });
      }
  
      // Hash the new password before storing it in the database
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password in the database
      user.password = hashedNewPassword;
      await user.save();
  
      // Send an email notification about the password change
      const transporter = nodemailer.createTransport({
        service: 'your-email-service-provider',
        auth: {
          user: 'your-email@example.com',
          pass: 'your-email-password',
        },
      });
  
      const mailOptions = {
        from: 'your-email@example.com',
        to: 'user-email@example.com', // You should replace this with the user's email
        subject: 'Password Changed',
        text: 'Your password has been changed successfully.',
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email could not be sent:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
  
      // Return a success response
      return res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
      console.error('Error in changePassword:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };