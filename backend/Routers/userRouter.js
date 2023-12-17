const express = require("express");
const multer = require("multer");

const userRouter = express.Router();
const { addUser, deleteAllUsers,sendTexttoDjango,getAllUsers } = require("../controller/userController");
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, `user-${Date.now()}.jpeg`);
  },
});

const upload = multer({
  storage: storage,
});

// const upload = multer({
//   dest: path.join('/public/photos'),
//   filename: (req, file, cb) => {
//     cb(null, `user-${Date.now()}.jpeg`);
//   },
// });


userRouter
.route('/api/getUsers')
.get(getAllUsers)

userRouter
.route("/api/addUser")
.post(upload.single("image"), addUser)




userRouter
.route('/api/delete')
.delete(deleteAllUsers)

userRouter
.route('/api/compareNgrams')
.get(sendTexttoDjango)

module.exports = upload;

module.exports = userRouter;
