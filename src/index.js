const express = require("express");
const cors = require("cors");
const db = require("./db");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const userRoutes = require("./routes/user");

const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
// const path = require("path");
// const http = require("http");
require("dotenv").config();

//Conexion a la Db
const CONNETION_URL = "mongodb://docker:mongopw@localhost:49153";

const app = express();
const PORT = process.env.PORT || 3050;

app.use(
	cors({
		origin: "*",
	}),
);
app.use(express.json());
app.use(fileUpload());
app.use(express.static(__dirname + "/public")); //Creacion de static files
app.use(bodyParser.json({ type: "application/json" }));

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/user", userRoutes);
app.use((req, res) => {
	res.status(404).send("Not Found");
});

/**
 *
 * *Try connection with db
 */
async function connectDb() {
	try {
		await db.connect(CONNETION_URL);
	} catch (error) {
		console.log("Error durante la conexion con la base de datos");
		console.error(error);
		process.exit(1);
	}
}
connectDb();

/**
 * *CONTROLLERS y MODELS
 */
const { connectUser, newMessage } = require("./controllers/socket.controller");
const { getChatsUsers } = require("./controllers/chat.controller");

//Levanto el server
const server = app.listen(PORT, () => {
	console.log(`server listen on port: ${PORT}`);
});

//Configuro los Cors de Socket
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

//Me conecto a socket
io.on("connect", (socket) => {
	//connect user to socket
	/**
	 * @param id user id
	 */
	socket.on("users:online", async ({ id }) => {
		//Conecto el usuario
		const users = await connectUser(id);

		//Emito el evento de que se conecto un usuario
		socket.emit("users:connected", users);
	});

	/**
	 * @param data Object -> {to, from} || {from,to}
	 */
	socket.on("chat:startChat", async (data) => {
		//Obtengo los chat del los usuarios
		const result = await getChatsUsers(data);

		//Guaro el ID de la conversacion para crear la sala
		const id = result[0]?.id;
		//Creo la sala
		socket.join(id);
		//Emito el evento con todos los mensajes entre los usuarios
		socket.to(id).emit("chat:messages", result);
	});

	/**
	 * @param {messaje, from, to}
	 */
	socket.on("chat:sendMessage", async ({ message, from, to }) => {
		//Armo el objeto de chat
		const msg = {
			from: from,
			to: to,
			message: message,
		};

		//Creo el nuevo mensaje que se envio
		const messages = await newMessage(msg);
		//emito el evento a los que pertenecen a la conversacion
		io.to(messages.id).emit("getMessage", messages);
	});

	// socket.on("disconnect", () => {
	// 	console.log("disconect");
	// 	removeUser(socket.id);
	// 	io.emit("getUser", users);
	// });
});
