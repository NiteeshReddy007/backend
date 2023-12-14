const Messages = require("../models/messageModel");
const mongoose = require("mongoose");
const logger =require('../logger/logger');
module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const projectedMessages = messages.map((msg) => {
      return {
        _id:msg._id,
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text
      };
    });
    logger.info('Retrieved messages successfully.');
    res.json(projectedMessages);
  } catch (ex) {
    logger.error(`Error in getMessages: ${ex.message}`);
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data)
    {
      logger.info('Message added successfully.');
      return res.json({ msg: "Message added successfully." });
    }
    else {
      logger.error('Failed to add message to the database.');
      return res.json({ msg: "Failed to add message to the database" });
    }
  } catch (ex) {
    logger.error(`Error in addMessage: ${ex.message}`);
    next(ex);
  }
};


module.exports.deleteMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    if (!messageId) {
      logger.error('Invalid message ID');
      return res.status(400).json({ error: 'Invalid message ID' });
    }
    const message = await Messages.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    await Messages.findByIdAndDelete(messageId);
    logger.info('Message deleted successfully.');
    res.json({ msg: 'Message deleted successfully' });
  } catch (error) {
    logger.error(`Error in deleteMessage: ${error.message}`);
    next(error);
    console.log("Error");
  }
};

// module.exports.deleteMessage = async (req, res, next) => {
//   try {
//     const {messageId} = req.params;
//     // if (!messageId) {
//     //   return res.status(400).json({ error: 'Invalid message ID' });
//     // }
//     // const message = await Messages.findById(ObjectId(messageId));
//     // if (!message) {
//     //   return res.status(404).json({ error: 'Message not found' });
//     // }
//     if (!mongoose.Types.ObjectId.isValid(messageId)) {
//       logger.error('Invalid message ID');
//       return res.status(400).json({ error: 'Invalid message ID' });
//     }
//     await Messages.findByIdAndDelete(mongoose.Types.ObjectId(messageId));
//     logger.info('Message deleted successfully.');
//     res.json({ msg: 'Message deleted successfully' });
//   } catch (error) {
//     logger.error(`Error in deleteMessage: ${error.message}`);
//     next(error);
//     console.log("Error");
//   }
// };



