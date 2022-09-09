const express = require("express");
const { verifyJwt } = require("../middleware/auth");
const {
	addMessage,
	getChatsUsersReq,
} = require("../controllers/chat.controller");
let router = express.Router();

router.post("/", addMessage);
router.get("/getChat", getChatsUsersReq);

module.exports = router;
