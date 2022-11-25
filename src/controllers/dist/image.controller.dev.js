"use strict";

var _require = require("uuid"),
    uuidv4 = _require.v4;

exports.uploadImage = function _callee2(files) {
  var img, uploadPath, msg, extension, imgName;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          //asignacion de valores
          img = files.image; //tomo la imagen del files en req

          extension = img.name.split(".")[1]; //extraigo la extension del archivo

          imgName = uuidv4() + "." + extension; //creo un nombre unico y le agrego la extension

          uploadPath = "./public/img/".concat(imgName); //le digo donde lo voy a guardar la img

          _context2.next = 6;
          return regeneratorRuntime.awrap(img.mv(uploadPath, function _callee(err) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!err) {
                      _context.next = 2;
                      break;
                    }

                    return _context.abrupt("return", {
                      error: true,
                      mensaje: err
                    });

                  case 2:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }));

        case 6:
          return _context2.abrupt("return", {
            error: false,
            mensaje: "File uploaded",
            name: imgName
          });

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
};