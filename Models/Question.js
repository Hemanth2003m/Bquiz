const mongoose = require('mongoose');


const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: { type: [String], required: true }, 
  correctAnswer: { type: String, required: true },
  
});
  

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;
