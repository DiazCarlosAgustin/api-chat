"use strict";

var Chat = require("../Model/chat.model");

var _require = require("./user.controller"),
    getAllUserOnline = _require.getAllUserOnline;

var connectUser = function connectUser(id) {
  var user;
  return regeneratorRuntime.async(function connectUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(getAllUserOnline(id));

        case 2:
          user = _context.sent;
          return _context.abrupt("return", user);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

var newMessage = function newMessage(_newMessage) {
  var userChat, msg, chatMsg, result, _msg;

  return regeneratorRuntime.async(function newMessage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          //Guardo los datos de los usuarios
          userChat = {
            from: _newMessage.from,
            to: _newMessage.to
          }; // armo el objeto de mensaje

          msg = {
            send_by: _newMessage.from,
            message: _newMessage.message,
            createdAt: Date.now()
          }; //Busco si hay chat entre los 2 usuarios

          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(Chat.findOne({
            $or: [{
              from: userChat.from,
              to: userChat.to
            }, {
              from: userChat.to,
              to: userChat.from
            }]
          }));

        case 5:
          chatMsg = _context2.sent;
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](2);
          return _context2.abrupt("return", {
            error: _context2.t0.message(),
            message: "Error al buscar la sala.",
            stutus: 400
          });

        case 11:
          result = [];
          _context2.prev = 12;

          if (!chatMsg) {
            _context2.next = 19;
            break;
          }

          _context2.next = 16;
          return regeneratorRuntime.awrap(Chat.findOneAndUpdate({
            _id: chatMsg._id
          }, {
            $push: {
              chats: msg
            }
          }));

        case 16:
          result = _context2.sent;
          _context2.next = 20;
          break;

        case 19:
          result = new Chat({
            from: userChat.from,
            to: userChat.to,
            chats: [msg]
          }).save();

        case 20:
          _context2.next = 25;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t1 = _context2["catch"](12);
          return _context2.abrupt("return", {
            status: 400,
            error: _context2.t1,
            message: "Error al intentar agregar el mensaje."
          });

        case 25:
          _context2.prev = 25;
          _context2.next = 28;
          return regeneratorRuntime.awrap(Chat.aggregate([{
            $match: {
              _id: chatMsg._id
            }
          }, {
            $unwind: "$chats"
          }, {
            $sort: {
              "chats.createdAt": -1
            }
          }]).limit(1));

        case 28:
          _msg = _context2.sent;
          return _context2.abrupt("return", {
            id: chatMsg.id,
            data: _msg[0].chats,
            message: "Se obtuvieron correctamente",
            status: 200
          });

        case 32:
          _context2.prev = 32;
          _context2.t2 = _context2["catch"](25);
          return _context2.abrupt("return", {
            status: 400,
            error: _context2.t2.message,
            message: "Error al intentar retornar el mensaje."
          });

        case 35:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 8], [12, 22], [25, 32]]);
};

module.exports = {
  connectUser: connectUser,
  newMessage: newMessage
};