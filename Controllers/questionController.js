const Question = require("../Models/Question");
const { StatusCodes } = require("http-status-codes");

exports.createQuestion = async (req, res, next) => {
  try {
    const { questionText, options, correctAnswer, category } = req.body;

    // Validate all required fields including category
    if (!questionText || !options || !correctAnswer || !category) {
      const error = new Error("All fields are required, including category");
      error.statusCode = StatusCodes.BAD_REQUEST;
      throw error;
    }

    const newQuestion = new Question({ questionText, options, correctAnswer, category });
    const savedQuestion = await newQuestion.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: savedQuestion,
    });
  } catch (err) {
    next(err); // Pass error to error handling middleware
  }
};
