const { v4: uuidv4 } = require("uuid");
exports.uploadImage = async (files) => {
	let img, uploadPath, msg;

	//asignacion de valores
	img = files.image; //tomo la imagen del files en req

	const extension = img.name.split(".")[1]; //extraigo la extension del archivo

	const imgName = uuidv4() + "." + extension; //creo un nombre unico y le agrego la extension

	uploadPath = `./public/img/${imgName}`; //le digo donde lo voy a guardar la img

	await img.mv(uploadPath, async (err) => {
		if (err) {
			return {
				error: true,
				mensaje: err,
			};
		}
	});
	return {
		error: false,
		mensaje: "File uploaded",
		name: imgName,
	};
};
