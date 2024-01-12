const express = require('express');
const router = express.Router();
const {QuestionCreate,QuestionUpdate,QuestionDelete,getAllQuestion,getQuestion} = require('../controllers/Questions');

router.post("/Question/create",QuestionCreate);  //correct
router.put("/Question/Update/:id",QuestionUpdate);  //correct hogya
router.delete("/Question/Delete/:id",QuestionDelete);//correct ho gya.
router.get("/Question/GetAll",getAllQuestion); // correct
router.get("/Question/GetQuestion/:id",getQuestion); //correct

module.exports = router; 
