const chat = require("../Model/chat.model");
const { newMessage } = require("./socket.controller");
const getChatsUsers = async (data) => {
	try {
		const user = { 0: data[1], 1: data[0] };
		const result = await chat.find({
			$or: [{ users: data }, { users: user }],
		});
		if (result.length > 0) {
			global.io.room = result[0].id;

			global.io.emit("chat:messages", result[0].chat);
		} else {
			let newChat = new chat({ users: data, chat: [] });
			const chatNew = await newChat.save();
			if (chatNew.length > 0) {
				global.io.room = chatNew[0].id;

				// global.io.join(sala);
				global.io.emit("chat:messages", chatNew[0].chat);
			}
		}
	} catch (error) {
		console.log(error);
	}
};

const addMessage = async (req, res) => {
	try {
		const result = await newMessage(req.body);
		res.status(200).json({
			message: "se envio correctamente",
			data: result,
		});
	} catch (error) {
		return [];
	}
};

module.exports = {
	getChatsUsers,
	addMessage,
};
