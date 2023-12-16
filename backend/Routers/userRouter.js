const express = require("express");
const multer = require("multer");

const userRouter = express.Router();
const { addUser, deleteAllUsers } = require("../controller/userController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `user-${Date.now()}.jpeg`);
  },
});

const upload = multer({
  storage: storage,
});
userRouter
.route("/api/addUser")
.post(upload.single("image"), addUser);

userRouter
.route('/api/delete')
.delete(deleteAllUsers)


module.exports = upload;

module.exports = userRouter;
