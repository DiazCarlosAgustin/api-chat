const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
	{
		from: {
			type: String,
			ref: "User",
		},
		to: {
			type: String,
			ref: "User",
		},
		chats: [
			{
				send_by: {
					type: String,
					ref: "User",
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
