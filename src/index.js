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

// const CONNETION_URL = `mongodb+srv://admin:${process.env.DB_PASS}@cluster0.hfgs2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
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
app.use(express.static(__dirname + "/public"));
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
const { getUser } = require("./controllers/user.controller");

const server = app.listen(PORT, () => {
	console.log(`server listen on port: ${PORT}`);
});

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

app.set("socketio", io);
global.io = io;

io.on("connect", (socket) => {
	//connect user to socket
	//get all users online
	socket.on("users:online", async ({ id }) => {
		const users = await connectUser(id);
		socket.emit("users:connected", users);
	});

	/**
	 * @param data Object -> {0:"id", 1:"id"} || [id, id]
	 * TODO: organizar esto QL
	 */
	socket.on("chat:startChat", async (data) => {
		const result = await getChatsUsers(data);
		const id = result[0]?.id;
		socket.join(id);

		socket.to(id).emit("chat:messages", result);
	});

	socket.on("chat:sendMessage", async ({ message, from, to }) => {
		const user = await getUser(to);
		const msg = {
			from: from,
			to: to,
			message: message,
		};
		await newMessage(msg);
		message = await getChatsUsers({ from, to });
		io.to(message[0].id).emit("getMessage", message);
	});

	// socket.on("disconnect", () => {
	// 	console.log("disconect");
	// 	removeUser(socket.id);
	// 	io.emit("getUser", users);
	// });
});
