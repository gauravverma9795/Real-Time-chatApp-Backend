const Messages = require("../models/messageModel");

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
        _id: msg._id,
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        edited: msg.edited,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
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

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};


module.exports.editMessage = async (req, res, next) => {
  try {
    const { messageId, newText } = req.body;

    if (!messageId || !newText) {
      return res.status(400).json({ msg: "Message ID and new text are required" });
    }

    const message = await Messages.findById(messageId);
    if (!message) return res.status(404).json({ msg: "Message not found" });

    message.message.text = newText;
    message.edited = true;
    await message.save();

    return res.json({ msg: "Message edited successfully" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.body;
    const message = await Messages.findById(messageId);
    if (!message) return res.status(404).json({ msg: "Message not found" });

    await message.remove();

    return res.json({ msg: "Message deleted successfully" });
  } catch (ex) {
    next(ex);
  }
};
