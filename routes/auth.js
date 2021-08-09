const router =require('express').Router();
//validaciones
const {check} = require('express-validator');

//MIddlewares
const {validarCampos, usuarioVerificacionLogin, validacionToken} = require('../middlewares');


//Controladores
const { login, renovarToken } = require('../controllers/auth');


router.post('/', [
    check('numeroC', 'El numeroC no puede ir vacio').notEmpty(),
    check('password', 'La contraseña no puede ir vacia').notEmpty(),
    check('password', 'La contraseña debe ser por lo menos 6 caracteres').isLength({min: 6}),
    usuarioVerificacionLogin,
    validarCampos
],login);

router.get('/', validacionToken, renovarToken);



//Exportando el router
module.exports = router;