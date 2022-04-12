const User = require("../Model/user.model");
const { validationResult } = require("express-validator");
const { uploadImage } = require("./image.controller");
const bcrypt = require("bcrypt");
const { singJwt } = require("../middleware/auth");
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

exports.createNewUser = async (req, res) => {
	const { username, email, status } = req.body;

	let img, image;

	const password = await bcrypt.hash(req.body.password, 10);

	const errors = validationResult(req).array();
	if (errors.length > 0) {
		res.status(400).json({ error: true, mensaje: errors });
	}

	if (!req.files || Object.keys(req.files).length === 0) {
		res.status(400).send({
			error: true,
			mensaje: "Debe de subir una imagen.",
		});
	}

	const user = await User.findOne({ email: email });
	if (user) {
		res.status(400).json({
			error: true,
			mensaje: "El email ya se encuentra registrado.",
		});
	}

	if (req.files != null) {
		img = await uploadImage(req.files);
		img.error ? (image = null) : (image = img.name);

		User.create({ username, email, password, status: 0, image })
			.then((user) => res.status(200).json(user))
			.catch((error) => {
				res.status(404).json({ error: true, mensaje: error });
			});
	}
};

exports.loginUser = async (req, res) => {
	const { username, password } = req.body;

	const errors = validationResult(req).array();
	if (errors.length > 0) {
		res.status(400).json({ errors: errors });
	}

	const user = await User.findOne({ username: username });

	if (!user) {
		res.status(404).json({
			error: true,
			mensaje: "El usuario ingresado no existe.",
		});
	}

	const validPassword = await bcrypt.compare(password, user.password);

	if (!validPassword) {
		return res.status(400).json({
			error: true,
			mensaje: "La contraseña ingresada no es correcta.",
		});
	}

	const token = await singJwt({
		username: username,
		password: password,
		email: user.email,
		id: user.id,
	});

	res.status(200).header("auth-token", token).json({
		error: false,
		message: "Bienvenido",
		data: user,
		token: token,
	});
};
