const express = require("express");
const cors = require("cors");
const db = require("./db");
const Routes = require("./routes/index");
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
app.use(express.static('public'))
app.use(bodyParser.json({ type: "application/json" }));
app.use(Routes);
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
const userController = require("./controllers/user.controller");
const chat = require("./Model/chat.model");

const server = app.listen(PORT, () => {
	console.log(`server listen on port: ${PORT}`);
});

const io = require("socket.io")(server);

io.on("connect", (socket) => {
	let users = {};
	console.log(`Connection stablished via id: ${socket.id}`);
	socket.on("users:online", async ({ id_usuario }) => {
		await userController.updateStatus(id_usuario);
		console.log(socket.rooms)
		const users = await userController.getAllUserOnline(id_usuario);
		users[socket.id] = id_usuario;
		io.emit("users:online", users);
	});

	/**
	 * @param data Object -> {0:"id", 1:"id"} || [id, id]
	 * TODO: async
	 */
	socket.on("chat:startChat", async (data) => {
		let arr1 = [data[1], data[0]];

		let completeData = {
			users: data,
			chatting: "",
		};

		chat.find(
			{ $or: [{ users: data }, { users: arr1 }] },
			(err, result) => {
				if (err) console.log(err);

				if (result.length > 0) {
					console.log(result)
					let sala = result[0].id;

					socket.join(sala);

					console.log(socket.rooms);
					let chats = result[0].chat;

					socket.emit("chat:messages", chats);

					socket.on("chat:newMessage", (newMessage) => {
						msg = {
							msg: newMessage.msg,
							from: newMessage.id,
							time: Date.now(),
						};

						chat.updateOne(
							{ $or: [{ users: data }, { users: arr1 }] },
							{ $push: { chat: msg } },
							(err, result) => {
								if (err) console.log(err);
								console.log(sala);
								io.to(sala).emit("chat:newMessage", msg);
							},
						);
					});
				} else {
					let newChat = new chat(completeData);
					newChat.save((err, res) => {
						if (err) console.log(err);
						console.log(res);
						let sala = res._id;

						socket.join(sala);

						socket.on("chat:newMessage", (newMessage) => {
							msg = {
								msg: newMessage.msg,
								from: newMessage.id,
								time: Date.now(),
							};

							chat.updateOne(
								{ $or: [{ users: data }, { users: arr1 }] },
								{ $push: { chat: msg } },
								(err, result) => {
									if (err) console.log(err);
									console.log(result)
									io.to(sala).emit("chat:newMessage", msg);
								},
							);
						});
					});
				}
			},
		);
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
