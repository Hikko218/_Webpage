const multer = require('multer');
const path = require('path');

// Speicherort + Dateinamen definieren
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage });

module.exports = upload;
