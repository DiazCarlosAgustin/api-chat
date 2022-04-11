const Chat = require("../Model/chat.model");

exports.getChatsByUserSender = async (sender, reciver) => {
	try {
		const result = await Chat.find({
			$and: [{ sender: { $eq: sender } }, { reciver: { $eq: reciver } }],
		}).sort({ date: 1 });
		return result;
	} catch (error) {
		return [];
	}
};

exports.addMessage = async (message, sender, reciver) => {
	try {
		chat.create({
			senderId: senderId,
			reciverId: reciver,
			message: message,
			date: new Date(),
		})
			.then((result) => {
				return true;
			})
			.catch((error) => {
				return false;
			});
	} catch (error) {
		return [];
	}
};
