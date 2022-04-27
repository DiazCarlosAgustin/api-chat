const Chat = require("../Model/chat.model");
const { getAllUserOnline } = require("./user.controller");

const connectUser = async (id) => {
	const users = await getAllUserOnline(id);
	global.io.emit("user:online", { sockedId: global.io.id });
	global.io.emit("users:online", { users: users });
};

const newMessage = async (newMessage) => {
	const user = { 0: newMessage.from, 1: newMessage.to };
	const user2 = { 0: newMessage.to, 1: newMessage.from };

	const msg = {
		from: newMessage.from,
		to: newMessage.to,
		message: newMessage.message,
		time: Date.now(),
	};
	const result = await Chat.findOneAndUpdate(
		{ $or: [{ users: user, users: user2 }] },
		{ $push: { chat: msg } },
		{ returnOriginal: false },
	);
	if (result.id) {
		global.io.room = result.id;
		await global.io.to(result.id).emit("chat:newMessage", msg);
		// return result;
	}
	return result;
};

module.exports = {
	connectUser,
	newMessage,
};
