const Question = require("../Models/Question");
const { StatusCodes } = require("http-status-codes");

exports.createQuestion = async (req, res, next) => {
  try {
    const { questionText, options, correctAnswer } = req.body;

    if (!questionText || !options || !correctAnswer) {
      const error = new Error("All fields are required");
      error.statusCode = StatusCodes.BAD_REQUEST;
      throw error;
    }

    const newQuestion = new Question({ questionText, options, correctAnswer });
    const savedQuestion = await newQuestion.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: savedQuestion,
    });
  } catch (err) {
    next(err); // Pass error to middleware
  }
};
