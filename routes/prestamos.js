
const router =require('express').Router();


const { check } = require('express-validator');
//Controladores
const { getPrestamos, postPrestamo, putPrestamo, borrarPrestamo, inactivarPrestamo   } = require('../controllers/prestamos');


//Middlewares
const {validacionToken, validarRole, validarCampos} = require('../middlewares')

router.get('/', getPrestamos);

router.post('/',[
    validacionToken,
    validarRole,
    check('usuario', 'El usuario no puede ir vacio').notEmpty(),
    check('usuario', 'id de usuario invalido').isMongoId(),
    check('libro', 'El libro no puede ir vacio').notEmpty(),
    check('libro', 'id de libro invalido').isMongoId(),
    check('fechaRetiro', 'La fecha retiro no puede venir vacia no puede ir vacio').notEmpty(),
    check('fechaDevolucion', 'La fecha de devolucion no puede venir vacia no puede ir vacio').notEmpty(),
    validarCampos
], postPrestamo);



router.put('/:prestamo', [
    validacionToken,
    validarRole
],putPrestamo);

router.put('/inactivar/:prestamo', [
    validacionToken,
    validarRole
],inactivarPrestamo);


router.delete('/:prestamo', [
    validacionToken,
    validarRole,
/*     check('prestamo', 'id invalido, verifquelo porfavor').isMongoId(),
    validarCampos */
], borrarPrestamo)


//Exportando el router
module.exports = router;