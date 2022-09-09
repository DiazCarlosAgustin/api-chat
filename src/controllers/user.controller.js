const User = require("../Model/user.model");
const { uploadImage } = require("./image.controller");
const bcrypt = require("bcrypt");
const { schemaRegister, schemaLogin } = require("../schemas/user");
const { singJwt } = require("../middleware/auth");

/**
 *
 * @param {any} user_id
 * @returns Usuarios conectados
 */
const getAllUserOnline = async (user_id) => {
	try {
		/**
		 * Busca los usuarios filtrando por el status y omitiendo el id del usuario que lo solicita.
		 */
		return await User.find({ _id: { $ne: user_id }, status: 1 });
	} catch (error) {
		//En caso de fallar retorno un array vacio.
		return [];
	}
};

/**
 *
 * @param {any} user_id
 * @returns Retorna la informacion del usuario a consultar
 */
const getUser = async (user_id) => {
	try {
		//obtengo el usuarios por _id
		return await User.find({ _id: { $eq: user_id } });
	} catch (error) {
		//en caso de fallar retorno un array vacio
		return [];
	}
};

/**
 *
 * @param {request} req
 * @param {response} res
 * @returns Retorna el usuario creado
 */
const createNewUser = async (req, res) => {
	let img, image;

	//valido los datos que recibo
	const { error } = schemaRegister.validate(req.body);

	//en caso de error retorno el error
	if (error) {
		return res.status(400).json({
			error: true,
			mensaje: error.details[0].message,
		});
	}

	//valido si estoy recibiendo un file tipo image o una url del imagen
	if (
		req.body.image == null &&
		(!req.files || Object.keys(req.files).length === 0)
	) {
		//si no estoy recibiendo nada retorno un mensaje
		return res.status(400).send({
			error: true,
			mensaje: "Debe de subir una imagen.",
		});
	}

	//guardo los datos que recibo del body
	const { username, email, status } = req.body;

	//hasheo la password
	const password = await bcrypt.hash(req.body.password, 10);

	//busco el usuario por email para validar que no exista
	const user = await User.findOne({ email: email });

	//en caso de que exista un usuario informo que ya existe.
	if (user) {
		return res.status(400).json({
			error: true,
			mensaje: "El email ya se encuentra registrado.",
		});
	}

	//si recibo la imagen en tipo file guardo la imagen en mi servidor y guardo el nombre en una variable
	if (req.files != null) {
		img = await uploadImage(req.files);
		img.error ? (image = null) : (image = img.name);
	}

	//en caso que reciba la imagen de tipo url la guardo en una variable
	if (req.body.image != null) {
		image = req.body.image;
	}

	//retorno el usuario creado
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
			//si falla al momento que se crea el usuario se informa del fallo
			res.status(404).json({ error: true, mensaje: error.message });
		});
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns retorno token y user logueado
 */
const loginUser = async (req, res) => {
	//guardo los datos del body
	const { username, password } = req.body;

	try {
		//valido si los datos recibidos son correctos
		const { error } = schemaLogin.validate(req.body);

		//si estan mal, retorno el fallo
		if (error) {
			return res.status(400).json({
				error: true,
				mensaje: error.details[0].message,
			});
		}
	} catch (err) {
		//si algo fallo informo del fallo
		return res.status(400).json({
			error: true,
			mensaje: err.message,
		});
	}

	//busco un usuario por username
	const user = await User.findOne({ username: username });

	//si no existe informo que no se encontro un usuario
	if (!user) {
		return res.status(404).json({
			error: true,
			mensaje: "El usuario ingresado no existe.",
		});
	}

	//comparo la password recibida por body con la que tiene el usuario en la DB
	const passDb = user.password;

	const validPassword = await bcrypt.compareSync(password, passDb);

	//si no es valida, informo que no es correcta.
	if (!validPassword) {
		return res.status(400).json({
			error: true,
			mensaje: "La contraseña ingresada no es correcta.",
		});
	}

	//genero el tocken
	const token = await singJwt({
		username: username,
		password: password,
		email: user.email,
		id: user.id,
	});

	//actualizo el status del usuario
	user.status = 1;
	//guardo el cambio
	user.save();

	//guardo el usuario sin el row password
	const userLoged = {
		_id: user._id,
		username: user.username,
		email: user.email,
		status: user.status,
		image: user.image,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	};

	//retorno el tocken y el usuario
	return res.status(200).json({
		error: false,
		message: "Bienvenido",
		data: { user: userLoged },
		token: token,
	});
};

module.exports = {
	loginUser,
	createNewUser,
	getUser,
	getAllUserOnline,
};
