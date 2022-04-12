const express = require("express");

let router = express.Router();

router.get("/", function (req, res) {
	res.status(200).json({ mensaje: "SUSSESS", error: false });
});

module.exports = router;
