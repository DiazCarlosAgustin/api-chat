const Joi = require("@hapi/joi");
exports.schemaRegister = Joi.object({
	username: Joi.string().min(6).max(255).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(8).max(255).required(),
});

exports.schemaLogin = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required(),
});
