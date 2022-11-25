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
	let chatMsg;
	try {
		chatMsg = await Chat.findOne({
			$or: [
				{ from: userChat.from, to: userChat.to },
				{ from: userChat.to, to: userChat.from },
			],
		});
	} catch (e) {
		return {
			error: e.message(),
			message: "Error al buscar la sala.",
			stutus: 400,
		};
	}

	let result = [];
	try {
		if (chatMsg) {
			result = await Chat.findOneAndUpdate(
				{ _id: chatMsg._id },
				{
					$push: {
						chats: msg,
					},
				},
			);
		} else {
			result = new Chat({
				from: userChat.from,
				to: userChat.to,
				chats: [msg],
			}).save();
		}
	} catch (error) {
		return {
			status: 400,
			error: error,
			message: "Error al intentar agregar el mensaje.",
		};
	}
	try {
		//funca esto pai
		const msg = await Chat.aggregate([
			{ $match: { _id: chatMsg._id } },
			{ $unwind: "$chats" },
			{ $sort: { "chats.createdAt": -1 } },
		]).limit(1);

		return {
			id: chatMsg.id,
			data: msg[0].chats,
			message: "Se obtuvieron correctamente",
			status: 200,
		};
	} catch (error) {
		return {
			status: 400,
			error: error.message,
			message: "Error al intentar retornar el mensaje.",
		};
	}
};

module.exports = {
	connectUser,
	newMessage,
};
