"use strict";

var chat = require("../Model/chat.model");

var _require = require("./socket.controller"),
    newMessage = _require.newMessage;

var getChatsUsers = function getChatsUsers(data) {
  var result;
  return regeneratorRuntime.async(function getChatsUsers$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(chat.find({
            $or: [{
              from: data.from,
              to: data.to
            }, {
              from: data.to,
              to: data.from
            }]
          }));

        case 3:
          result = _context.sent;

          if (!(result.length <= 0)) {
            _context.next = 8;
            break;
          }

          _context.next = 7;
          return regeneratorRuntime.awrap(chat.create({
            from: data.from,
            to: data.to,
            chats: []
          }));

        case 7:
          result = _context.sent;

        case 8:
          return _context.abrupt("return", result);

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var getChatsUsersReq = function getChatsUsersReq(req, res) {
  var data, chat;
  return regeneratorRuntime.async(function getChatsUsersReq$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          data = {
            from: req.query.from,
            to: req.query.to
          };
          _context2.next = 3;
          return regeneratorRuntime.awrap(getChatsUsers(data));

        case 3:
          chat = _context2.sent;
          res.status(200).json({
            chat: chat
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var addMessage = function addMessage(req, res) {
  var result;
  return regeneratorRuntime.async(function addMessage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(newMessage(req.body));

        case 2:
          result = _context3.sent;
          res.status(200).json({
            result: result
          });

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = {
  getChatsUsers: getChatsUsers,
  getChatsUsersReq: getChatsUsersReq,
  addMessage: addMessage
};