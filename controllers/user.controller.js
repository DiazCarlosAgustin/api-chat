const User = require("../Model/user.model");
exports.getAllUserOnline = async (user_id) => {
	try {
		const result = await User.find({ _id: { $ne: user_id }, status: 1 });
		return result;
	} catch (error) {
		return [];
	}
};

exports.updateStatus = async (user_id) => {
	User.updateOne(
		{ _id: { $eq: user_id } },
		{ $set: { status: 1 } },
		(err, user) => {
			if (err) throw err;
		},
	);
};

exports.getUser = async (user_id) => {
	try {
		const result = await User.find({ _id: { $eq: user_id } });
		return result;
	} catch (error) {
		return [];
	}
};
