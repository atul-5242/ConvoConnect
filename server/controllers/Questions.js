const QuestionPage = require("../models/QuestionPage");


exports.QuestionCreate = async (req,res)=>{
    try {
        const {questionName,questionLink,author}=req.body;
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
            message:`Failed to Question Creation.${error.message}`,
        });
    }
}

exports.QuestionDelete = async (req,res)=>{
    try {
        const questionIdToDelete = req.params.questionId;
        const dataToDelete =await QuestionPage.deleteOne(
            { _id: questionIdToDelete }
        )
        return res.status(200).json({
            success:true,
            message:"Question Deleted Successfully.",
            data:questions,
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`Failed to Question Creation.${error.message}`,
            dataDeleted:dataToDelete,
        });
    }
}

exports.QuestionUpdate = async (req,res) =>{
    try {
        const questionIdToUpdate = req.params.serialno;
        if(!questionIdToUpdate){
            return res.status(400).json({
                success:false,
                message:"sectionName or SectionId name is not present.",
            });
        }
        const updatedQuestion = await QuestionPage.findOneAndUpdate(
            { serialno: questionIdToUpdate },
            { $set: updatedData }, // Assuming you want to update the entire document with the new data
            { new: true, useFindAndModify: false }
        );
        if (updatedQuestion) {
            res.status(200).json({
                success: true,
                message: "Question updated successfully.",
                data: updatedQuestion,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Question not found.",
            });
        }
       
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error Can't Updated Question.",
        });
    }
}


exports.getAllQuestion = async (req,res) =>{
    try {
        const allQuestions= await QuestionPage.findOne({}) 
                                .populate({
                                    path:"QuestionPage",
                                    select:"questionName questionLink uploadDate author serialno",
                                })
                                .exec();
        return res.status(200).json({
            success:true,
            message:"All Questions Successfully.",
            data:allQuestions,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"All Fecthing Invalid Request",
        });
    }
}