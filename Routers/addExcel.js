const express = require('express');
const router = express.Router();
const upload = require('../Middilwares/upload'); // Multer middleware
const { uploadExcel } = require('../Controllers/excelController');

router.post('/addExcel', upload.single('file'), uploadExcel);

module.exports = router;
