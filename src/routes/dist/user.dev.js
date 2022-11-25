"use strict";

var express = require("express");

var _require = require("../controllers/user.controller"),
    getAllUserOnline = _require.getAllUserOnline,
    validEmailUser = _require.validEmailUser;

var router = express.Router(); // router.post("/", addMessage);

router.get("/getChat", function _callee(req, res) {
  var id, result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.query.id;
          _context.next = 3;
          return regeneratorRuntime.awrap(getAllUserOnline(id));

        case 3:
          result = _context.sent;
          res.json({
            result: result
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.get("/validUser", function _callee2(req, res) {
  var email, result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          email = req.query.email;
          _context2.next = 3;
          return regeneratorRuntime.awrap(validEmailUser(email));

        case 3:
          result = _context2.sent;
          res.status(200).json({
            result: result
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
});
module.exports = router;