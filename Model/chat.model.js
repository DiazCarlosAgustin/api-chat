const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
	{
		users: {
			type: Array,
		},
		chat: [
			{
				from: {
					type: String,
				},
				to: {
					type: String,
				},
				message: {
					type: String,
				},
				createdAt: {
					type: Date,
				},
			},
		],
	},
	{ timestamps: true },
);

const chatModel = mongoose.model("chat", chatSchema);

module.exports = chatModel;
