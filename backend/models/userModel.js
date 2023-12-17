const mongoose = require("mongoose");

const db_link =
  "mongodb+srv://2020ucp1795:vX5Ze40VxzDTMykq@cluster0.r6ygflx.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(db_link)
  .then(function (db) {
    //console.log(db)
    console.log("user db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

var UserSchema = new mongoose.Schema({
  id: String,
  friendList: [String],
  image:{ 
    type:String,
    default:'profile.jpg'
  },
  password: String,
});

const userModel = mongoose.model("User", UserSchema);

module.exports = userModel;
