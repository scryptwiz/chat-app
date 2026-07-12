const Message = require("../models/Message");

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

const createMessage = async (req, res) => {
  try {
    const { username, text } = req.body;
    const message = await Message.create({ username, text });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
};

module.exports = { getMessages, createMessage };
