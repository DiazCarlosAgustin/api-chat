const User = require("../Model/user.model");
const { uploadImage } = require("./image.controller");
const bcrypt = require("bcrypt");
const { schemaRegister, schemaLogin } = require("../schemas/user");
const { singJwt } = require("../middleware/auth");

const getAllUserOnline = async (user_id) => {
	try {
		const result = await User.find({ _id: { $ne: user_id }, status: 1 });
		return result;
	} catch (error) {
		return [];
	}
};

const getUser = async (user_id) => {
	try {
		const result = await User.find({ _id: { $eq: user_id } });
		return result;
	} catch (error) {
		return [];
	}
};

const createNewUser = async (req, res) => {
	let img, image;

	const { error } = schemaRegister.validate(req.body);
	if (error) {
		return res.status(400).json({
			error: true,
			mensaje: error.details[0].message,
		});
	}

	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send({
			error: true,
			mensaje: "Debe de subir una imagen.",
		});
	}

	const { username, email, status } = req.body;
	const password = await bcrypt.hash(req.body.password, 10);

	const user = await User.findOne({ email: email });

	if (user) {
		return res.status(400).json({
			error: true,
			mensaje: "El email ya se encuentra registrado.",
		});
	}

	if (req.files != null) {
		img = await uploadImage(req.files);
		img.error ? (image = null) : (image = img.name);

		return await User.create({
			username,
			email,
			password,
			status: 0,
			image,
		})
			.then((user) =>
				res.status(200).json({
					user,
					mensaje: "Se registro correctamente.",
					error: false,
				}),
			)
			.catch((error) => {
				res.status(404).json({ error: true, mensaje: error });
			});
	}
};

const loginUser = async (req, res) => {
	const { username, password } = req.body;

	try {
		const { error } = schemaLogin.validate(req.body);
		if (error) {
			return res.status(400).json({
				error: true,
				mensaje: error.details[0].message,
			});
		}
	} catch (err) {
		return res.status(400).json({
			error: true,
			mensaje: err,
		});
	}

	const user = await User.findOne({ username: username });

	if (!user) {
		return res.status(404).json({
			error: true,
			mensaje: "El usuario ingresado no existe.",
		});
	}

	const passDb = user.password;

	const validPassword = await bcrypt.compareSync(password, passDb);

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

	user.status = 1;
	user.save();

	return res.status(200).json({
		error: false,
		message: "Bienvenido",
		data: { user },
		token: token,
	});
};

module.exports = {
	loginUser,
	createNewUser,
	getUser,
	getAllUserOnline,
};
