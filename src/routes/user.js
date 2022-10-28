const express = require("express");
const {
	getAllUserOnline,
	validEmailUser,
} = require("../controllers/user.controller");
let router = express.Router();

// router.post("/", addMessage);
router.get("/getChat", async (req, res) => {
	const id = req.query.id;

	const result = await getAllUserOnline(id);

	res.json({ result });
});

router.get("/validUser", async (req, res) => {
	console.log(req.query);
	const email = req.query.email;
	const result = await validEmailUser(email);

	res.status(200).json({ result });
});

module.exports = router;
