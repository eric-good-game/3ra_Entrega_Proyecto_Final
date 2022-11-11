import multer, {FileFilterCallback} from "multer";
import path from "path";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    },
})
const checkFileType = function (file:Express.Multer.File, cb:FileFilterCallback) {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error("Error: You can Only Upload Images!!"));
    }
  };
const upload = multer({ 
    storage: storage,
    fileFilter(req, file, callback) {
        checkFileType(file, callback);
    },
})

export default upload;