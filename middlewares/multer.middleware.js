import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, files, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
    // imagesArray.push(`${Date.now()}_${file.originalname}`)
  },
});

const upload = multer({ storage: storage });

export default upload;
