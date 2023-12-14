const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const logger =require('../logger/logger');
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user){
      logger.info(`Login failed for username: ${username}, incorrect username or password`);
      return res.json({ msg: "Incorrect Username or Password", status: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid){
      logger.info(`Login failed for username: ${username}, incorrect username or password`);
      return res.json({ msg: "Incorrect Username or Password", status: false });
    }
    delete user.password;
    logger.info(`User ${username} logged in successfully.`);
    return res.json({ status: true, user });
  } catch (ex) {
    logger.error(`Error in login: ${ex.message}`);
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    console.log(req)
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck){
      logger.info(`Registration failed for username: ${username}, username already used`);
      return res.json({ msg: "Username already used", status: false });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
    {
      logger.info(`Registration failed for email: ${email}, email already used`);
      return res.json({ msg: "Email already used", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    logger.info(`User ${username} registered successfully.`);
    return res.json({ status: true, user });
  } catch (ex) {
    logger.error(`Error in register: ${ex.message}`);
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    logger.info('Retrieved all users successfully.');
    return res.json(users);
  } catch (ex) {
    logger.error(`Error in getAllUsers: ${ex.message}`);
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    logger.info(`Avatar set successfully for user with ID: ${userId}`);
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    logger.error(`Error in setAvatar: ${ex.message}`);
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) {
      logger.info('User ID is required for logout.');
      return res.json({ msg: "User id is required " });
    }
    onlineUsers.delete(req.params.id);
    logger.info(`User with ID ${req.params.id} logged out successfully.`);
    return res.status(200).send();
  } catch (ex) {
    logger.error(`Error in logOut: ${ex.message}`);
    next(ex);
  }
};
