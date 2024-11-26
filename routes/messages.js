const express = require("express");
const router = express.Router();
const {
  addMessage,
  getMessages,
  editMessage,
  deleteMessage
} = require("../controllers/messageController");

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/edit/", editMessage);
router.post("/delete/", deleteMessage);

module.exports = router;
