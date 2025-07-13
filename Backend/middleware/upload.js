const multer = require('multer');
const path   = require('path');
const debug  = require('debug')('app:upload');

// File-upload configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dest = path.join(__dirname, '..', 'public', 'uploads');
    debug(`Saving file to ${dest}`);
    cb(null, dest);
  },
  filename(req, file, cb) {
    const unique = `${Date.now()}-${file.originalname}`;
    debug(`Generated filename: ${unique}`);
    cb(null, unique);
  }
});

// File filter to allow only specific file types
// Currently allows PNG and JPEG images
function fileFilter(req, file, cb) {
  const allowed = /png|jpe?g/i.test(path.extname(file.originalname));
  if (!allowed) {
    debug(`Rejected file: ${file.originalname}`);
    return cb(new Error('Only PNG/JPG allowed'), false);
  }
  cb(null, true);
}

const upload = multer({ storage, fileFilter });

module.exports = upload;

