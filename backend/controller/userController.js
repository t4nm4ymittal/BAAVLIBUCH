const userModel = require("../models/userModel");

module.exports.addUser = async function (req, res) {
  try {
    const { id, friendId, password, image } = req.body;
    // console.log(req.body);
    console.log(req.file);

    let existingUser = await userModel.findOne({ id: id });
    if (!existingUser) {
      newUser = new userModel({ id: id });
      existingUser = await newUser.save();
      console.log("newUser" + existingUser);
    }
    existingUser = await userModel.findOne({ id: friendId });
    if (!existingUser) {
      newUser = new userModel({
        id: friendId,
        password: password,
        image: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
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


module.exports.deleteAllUsers=async function deleteAllUsers() {
  try {
    // Use the deleteMany method to delete all records in the userModel
    const result = await userModel.deleteMany({});

    // Log the result or handle it as needed
    console.log('Deleted:', result.deletedCount, 'users');
  } catch (error) {
    console.error('Error deleting users:', error);
  }
}
// module.exports = {  deleteAllUsers };