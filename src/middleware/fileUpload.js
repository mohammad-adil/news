const multer = require("multer");
const router = require("express").Router();
const path = require("path");
const { generateResponse } = require("./responseHandler");
const dirName = path.join(__dirname, "../public");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dirName);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now() + "." + ext}`);
  },
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  storage: storage,
  fileFilter(req, file, cb) {
    console.log(file.originalname);
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});

// Treat posted file
//const upload = multer({ storage: storage }).single("avatar");

router.post("/image", upload.single("avatar"), async (req, res, next) => {
  try {
    let response = "";
    if (!req.file.filename) {
      response = generateResponse([], [], 500, "Somethinh went Wrong");
      res.status(500).send(response);
    }
    response = await generateResponse(
      { filename: req.file.filename, size: req.file.size },
      "",
      200,
      "File Uploaded Success"
    );

    res.send(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
