const QuestionPage = require("../models/AnswerPage");

exports.AnswerCreate = async (req,res)=>{
    try {
        const {nameAuthour,codeupload}=req.body;
        const author=user.id;
        if (!questionName || !questionLink || !author) {
            return res.status(400).json({
                success:false,
                message:"All details are not present.",
            });
        }
        const questions = await QuestionPage.create({
            questionName:questionName,
            questionLink:questionLink,
            author:author,
        })
        return res.status(200).json({
            success:true,
            message:"Question Created Successfully.",
            data:questions,
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`Failed to Answer Creation.${error.message}`,
        });
    }
}
