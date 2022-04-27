const express = require("express");
const cors = require("cors");
const db = require("./db");

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");

const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
// const path = require("path");
// const http = require("http");
require("dotenv").config();

const CONNETION_URL = `mongodb+srv://admin:${process.env.DB_PASS}@cluster0.hfgs2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
const PORT = process.env.PORT || 3050;

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(bodyParser.json({ type: "application/json" }));

app.use(indexRoutes);
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
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

const { connectUser } = require("./controllers/socket.controller");
const { getChatsUsers } = require("./controllers/chat.controller");
const server = app.listen(PORT, () => {
	console.log(`server listen on port: ${PORT}`);
});

const io = require("socket.io")(server);

global.io = io;

io.on("connect", (socket) => {
	//connect user to socket
	//get all users online
	socket.on("users:online", async ({ id }) => {
		await connectUser(id);
	});

	/**
	 * @param data Object -> {0:"id", 1:"id"} || [id, id]
	 * TODO: organizar esto QL
	 */
	socket.on("chat:startChat", async (data) => {
		getChatsUsers(data);
	});

	// socket.on("chat:sendMessage", async ({ message, senderId, reciverId }) => {
	// 	const user = await getUser(reciverId);
	// 	await chatController.addMessage(message, senderId, reciverId);
	// 	message = await messageController.getChatsByUserSender(
	// 		senderId,
	// 		reciverId,
	// 	);
	// 	io.to(user.socketId).emit("getMessage", message);
	// });

	// socket.on("disconnect", () => {
	// 	console.log("disconect");
	// 	removeUser(socket.id);
	// 	io.emit("getUser", users);
	// });
});
