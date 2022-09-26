const chat = require("../Model/chat.model");
const { newMessage } = require("./socket.controller");

const getChatsUsers = async (data) => {
	try {
		const result = await chat.find({
			$or: [
				{ from: data.from, to: data.to },
				{ from: data.to, to: data.from },
			],
		});
		return result;
	} catch (error) {
		console.log(error);
	}
};

const getChatsUsersReq = async (req, res) => {
	const data = { from: req.query.from, to: req.query.to };
	const chat = await getChatsUsers(data);

	res.status(200).json({ chat });
};

const addMessage = async (req, res) => {
	const result = await newMessage(req.body);
	res.status(200).json({
		result,
	});
};

module.exports = {
	getChatsUsers,
	getChatsUsersReq,
	addMessage,
};
