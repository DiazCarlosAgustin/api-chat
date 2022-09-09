const express = require("express");
const { getAllUserOnline } = require("../controllers/user.controller");
let router = express.Router();

// router.post("/", addMessage);
router.get("/getChat", async (req, res) => {
	const id = req.query.id;

	const result = await getAllUserOnline(id);

	res.json({ result });
});

module.exports = router;
