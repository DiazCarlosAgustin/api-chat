const express = require("express");
const { verifyJwt } = require("../middleware/auth");
const { addMessage } = require("../controllers/chat.controller");
let router = express.Router();

router.post("/", verifyJwt, addMessage);

module.exports = router;
