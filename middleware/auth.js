const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY || "someText";

exports.singJwt = async (data) => {
	return await jwt.sign(data, secret);
};

exports.verifyJwt = (req, res, next) => {
	const token = req.header("auth-token");
	if (!token) {
		return res
			.status(400)
			.json({ message: "Acceso denegado.", error: true });
	}

	try {
		const verified = jwt.verify(token, secret);

		req.user = verified;
		next();
	} catch (error) {
		return res.status(400).json({ message: error, error: true });
	}
};
