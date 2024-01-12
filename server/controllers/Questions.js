const QuestionPage = require("../models/QuestionPage");


exports.QuestionCreate = async (req,res)=>{//Done
    try {
        const {questionName,questionLink,author,serialno}=req.body;
        
        if (!questionName || !questionLink || !author || !serialno) {
            return res.status(400).json({
                success:false,
                message:"All details are not present.",
            });
        }
        const questions = await QuestionPage.create({
            questionName:questionName,
            questionLink:questionLink,
            author:author,
            serialno:serialno,
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
        const questionIdToDelete = req.params.id;

        const dataToDelete =await QuestionPage.findByIdAndDelete(
            { _id: questionIdToDelete }
        )
        return res.status(200).json({
            success:true,
            message:"Question Deleted Successfully.",
            data:dataToDelete,
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`Failed to Question Deletion.${error.message}`,
            // dataDeleted:dataToDelete,
        });
    }
}

exports.QuestionUpdate = async (req,res) =>{
    try {
        const serialno = req.params.id;
        const {questionName,questionLink,author}=req.body;
        console.log(questionName);
        if (!questionName || !questionLink || !author) {
            return res.status(400).json({
                success:false,
                message:"All details are not present.",
            });
        }
        if(!serialno){
            return res.status(400).json({
                success:false,
                message:"sectionName or SectionId name is not present.",
            });
        }
        const updatedQuestion = await QuestionPage.findOneAndUpdate(
            { _id: serialno },
            { $set: {
                questionName:questionName,
                questionLink:questionLink,
                author:author
            } }, // Assuming you want to update the entire document with the new data
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
        const q=req.params;

        const allQuestions= await QuestionPage.find() 
                                // .populate({
                                //     // path:"QuestionPage",
                                //     select:"questionName questionLink uploadDate author serialno",
                                // })
                                // .exec();
        return res.status(200).json({
            success:true,
            message:"All Questions Successfully.",
            data:allQuestions,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"All Fetching Invalid Request",
        });
    }
}

exports.getQuestion = async (req,res) =>{
    try {
        const Qid=req.params;
        const Question=await QuestionPage.findById(Qid.id) ;
                               
        return res.status(200).json({
            success:true,
            message:"Question Successfully found.",
            data:Question,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
        });
    }
}