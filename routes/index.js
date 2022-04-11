const express = require("express");
const { check, validationResult } = require("express-validator");
const {v4: uuidv4 } = require("uuid")

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
	function (req, res) {
		const username = req.body.username;
		const email = req.body.email;
		const password = req.body.password;
		const status = req.body.status;

		const errors = validationResult(req).array();
		if (errors.length > 0) {
			return res.status(400).json({ errors: errors });
		}

		UserModel.create({ username, email, password, status: 0 })
			.then((user) => res.status(200).json(user))
			.catch((error) => {
				res.status(404).json({ errors: error });
			});
	},
);

Router.post('/uploadimg', (req,res) =>{
	let img, uploadPath; //declaracion de variables

	//validación si existe FILES en el req 
	if(!req.files || Object.keys(req.files).length === 0){
		res.status(400).send({error: true, mensaje: 'Debe de subir una imagen.'});
	}

	//asignacion de valores 
	img = req.files.image; //tomo la imagen del files en req
	const extension = img.name.split('.')[1]; //extraigo la extension del archivo
	
	const imgName = uuidv4() + '.' + extension //creo un nombre unico y le agrego la extension 

	uploadPath = `./public/img/${imgName}`; //le digo donde lo voy a guardar la img
	
	img.mv(uploadPath, err => { //intento subir la imagen
		if(err) return res.status(500).json({error: 500, mensaje: err}) //retorno el error en caso de que falle

		res.status(200).json({mensaje: 'File uploaded!', name: imgName}) //retorno el nombre de la imagen con un mensaje que se subio correctamente la img
	})
})

module.exports = Router;
