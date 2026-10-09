import multer from 'multer';
import createHttpError from 'http-errors';

const storage = multer.memoryStorage();

const limits = {
  fileSize: 2 * 1024 * 1024, // 2MB
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(createHttpError(400, 'Only images allowed'));
  }
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});
