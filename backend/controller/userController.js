const userModel = require("../models/userModel");

const axios = require("axios");
module.exports.addUser = async function (req, res) {
  try {
    const { id, friendId, password, image } = req.body;
    // console.log(req.body);
    console.log(req.file);

    let existingUser = await userModel.findOne({ id: id });
    if (!existingUser) {
      newUser = new userModel({ id: id });
      existingUser = await newUser.save();
      // console.log("newUser" + existingUser);
    }
    existingUser = await userModel.findOne({ id: friendId });
    if (!existingUser) {
      newUser = new userModel({
        id: friendId,
        password: password,
        image: req.file.filename,
      });
      existingUser = await newUser.save();
      console.log("newUser" + existingUser);
    }
    const friend = await userModel.findOne({ id: friendId });

    friend.friendList = [...new Set([...friend.friendList, id])];
    const updatedFriend = await friend.save();
    return res.json({
      message: "new user created",
      updatedFriend: updatedFriend,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "d" + err,
    });
  }
};

module.exports.deleteAllUsers = async function deleteAllUsers() {
  try {
    // Use the deleteMany method to delete all records in the userModel
    const result = await userModel.deleteMany({});

    // Log the result or handle it as needed
    console.log("Deleted:", result.deletedCount, "users");
  } catch (error) {
    console.error("Error deleting users:", error);
  }
};
module.exports.getAllUsers = async function getAllUsers(req, res) {
  try {
    const users = await userModel.find();
   // console.log("esd");
    console.log(users[1].image)
    res.json({ users: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.sendTexttoDjango = async function sendTexttoDjango(req, res) {
  try {
    let recentText = await userModel
      .find({})
      .select("id")
      .limit(2)
      .sort({ $natural: -1 });

    if (!recentText) {
      return res.json({
        message: "Atleast two records required",
      });
    }

    const [text1, text2] = recentText.map((item) => item.id);
    console.log(text1, text2);
    axios
      .post("http://127.0.0.1:8000/user", { text1, text2 })
      .then((response) => {
        const ngrams = response.data;
        console.log(ngrams);
        res.json({ ngrams });
      });
  } catch (error) {
    console.error("error" + error);
    res.status(500).send("Internal Server Error");
  }
};
