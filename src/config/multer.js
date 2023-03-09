import multer from "multer";
// Multer config

export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});
