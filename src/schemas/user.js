const Joi = require("@hapi/joi");
exports.schemaRegister = Joi.object({
	username: Joi.string().min(6).max(255).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(3).max(255).required(),
	image: Joi.string(),
});

exports.schemaLogin = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required(),
});
