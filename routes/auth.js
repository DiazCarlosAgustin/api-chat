import {Router} from 'express'
import { createNewUser } from '../controllers/user.controller';
import { check, validationResult } from ("express-validator");

let router = Router();

router.post('/register',[
    check(
        "username",
        "El usuario requerido y tiene que tener al menos 5 caracteres.",
    )
        .notEmpty()
        .escape()
        .isLength({ min: 5 }),
    check("email", "El Email ingresado no es valido").notEmpty().isEmail(),
    check(
        "password",
        "La contraseña ingresada, no es valida. Debe de tener al menos 6 caracteres.",
    )
        .notEmpty()
        .isLength({ min: 6 }),
], createNewUser())


exports.default = router
