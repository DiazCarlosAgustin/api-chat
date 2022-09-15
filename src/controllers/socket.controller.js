const Chat = require("../Model/chat.model");
const { getAllUserOnline } = require("./user.controller");

const connectUser = async (id) => {
	const user = await getAllUserOnline(id);
	return user;
};

const newMessage = async (newMessage) => {
	//Guardo los datos de los usuarios
	const userChat = {
		from: newMessage.from,
		to: newMessage.to,
	};
	// armo el objeto de mensaje
	const msg = {
		send_by: newMessage.from,
		message: newMessage.message,
		createdAt: Date.now(),
	};

	//Busco si hay chat entre los 2 usuarios
	const chatMsg = await Chat.findOne({
		$or: [
			{ from: userChat.from, to: userChat.to },
			{ from: userChat.to, to: userChat.from },
		],
	});

	let result = [];

	if (chatMsg != null) {
		result = await Chat.findOneAndUpdate(
			{ _id: chatMsg._id },
			{ $push: { chats: msg } },
		);
	} else {
		result = new Chat({
			from: userChat.from,
			to: userChat.to,
			chats: [msg],
		}).save();
	}
	// const result = await Chat.insert(
	// 	{},
	// 	{ $push: { chat: msg } },
	// 	{ returnOriginal: false },
	// );
	// let result = { id: "626347f04dac1f318721f04b" };
	// if (result?.id) {
	// 	// console.log(socket.handshake.query.room);
	// 	return result;
	// }
	return result;
};

module.exports = {
	connectUser,
	newMessage,
};
