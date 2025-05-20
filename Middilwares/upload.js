const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      return cb(new Error('Only Excel files are allowed'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;
