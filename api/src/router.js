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
    callback(null, false, new Error('Wrong File Type'));
  } else {
    callback(null, true);
  }
};

const upload = multer({ fileFilter, storage });

router.post('/upload', upload.single('photo'), (request, response) => {
  if (request.fileValidationError)
    return response.status(400).json({ Error: request.fileValidationError });

  return response.status(201).json({ Success: true });
});
module.exports = router;
