const mongoose = require("mongoose");

mongoose.connection.on("connected", () => {
	console.log("Connection established");
});

mongoose.connection.on("reconnected", () => {
	console.log("Connection restablished");
});

mongoose.connection.on("disconnected", () => {
	console.log("Connection disconnected");
});

mongoose.connection.on("close", () => {
	console.log("Connection closed");
});

mongoose.connection.on("error", (error) => {
	console.log("Error: " + error);
});

/**
 *
 * @param {String} url connection url db
 * @returns connection
 */
async function connect(url) {
	return await mongoose.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
}

module.exports.connect = connect;
