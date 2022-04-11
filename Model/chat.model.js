const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
	users: {
		type: Array,
	},
	chat: {
		type: Array,
	},
});

const chatModel = mongoose.model("chat", chatSchema);

module.exports = chatModel;
