const express = require("express");

const { verifyJwt } = require("../middleware/auth");
let router = express.Router();
const {
	createNewUser,
	loginUser,
	logoutUser,
} = require("../controllers/user.controller");

router.post("/register", createNewUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/test", verifyJwt, (req, res) => {
	res.status(200).json({ message: "oK" });
});

module.exports = router;
