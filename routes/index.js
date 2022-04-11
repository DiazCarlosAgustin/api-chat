const express = require("express");
const { check, validationResult } = require("express-validator");
const imageController = require("../controllers/image.controller");

let Router = express.Router();


const UserModel = require("../Model/user.model");

Router.post(
	"/register",
	[
		check(
			"username",
			"El usuario requerido y tiene que tener al menos 5 caracteres.",
		)
			.notEmpty()
			.escape()
			.isLength({ min: 5 }),
		check("email", "El Email ingresado no es valido").notEmpty().isEmail(),
		check(
			"password",
			"La contraseña ingresada, no es valida. Debe de tener al menos 6 caracteres.",
		)
			.notEmpty()
			.isLength({ min: 6 }),
	],
	async function (req, res) {
		const username = req.body.username;
		const email = req.body.email;
		const password = req.body.password;
		const status = req.body.status;
		let img,image;

		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.status(400).json({ errors: errors });
		}

		if(!req.files || Object.keys(req.files).length === 0){
			res.status(400).send({error: true, mensaje: 'Debe de subir una imagen.'});
		}
		if(req.files != null){
			img = await imageController.uploadImage(req.files)
			img.error ? image = null : image = img.name
	
			UserModel.create({ username, email, password, status: 0, image })
				.then((user) => res.status(200).json(user))
				.catch((error) => {
					res.status(404).json({ errors: error });
				});
		}
	},
);


module.exports = Router;
