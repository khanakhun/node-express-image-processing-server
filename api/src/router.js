const { Router } = require('express');
const multer = require('multer');

const router = Router();

const filename = (request, file, callback) => {
  callback(null, file.originalname);
};

const storage = multer.diskStorage({ destination: 'api/uploads/', filename });

const fileFilter = (request, file, callback) => {
  if (file.mimetype !== 'image/png') {
    request.fileValidationError = 'Wrong file type';
    callback(null, false, { Error: 'Wrong File type' });
  } else {
    callback(null, true);
  }
};

const upload = multer({ fileFilter, storage });

router.post('/upload', upload.single('photo'), (req, res) => {
  let { fileValidationError } = req.body;
  if (fileValidationError) {
    res.status(400).json({ Error: fileValidationError });
  }
  res.status(201).json({ Success: true });
});
module.exports = router;
