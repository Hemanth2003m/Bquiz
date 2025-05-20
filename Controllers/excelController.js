const XLSX = require('xlsx');
const QuestionModel = require('../Models/Question');

const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const formattedData = data.map(item => ({
      questionText: item.questionText,
      options: item.options.split(',').map(opt => opt.trim()),
      correctAnswer: item.correctAnswer,
      category: item.category  // <-- Add category here
    }));

    await QuestionModel.insertMany(formattedData);
    res.status(200).send({ message: 'File uploaded and data saved successfully!' });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send({ message: 'Failed to process file' });
  }
};

module.exports = { uploadExcel };
