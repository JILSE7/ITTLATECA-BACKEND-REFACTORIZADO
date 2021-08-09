const router =require('express').Router();
//Express-validator
const {check} = require('express-validator');

//Controladores
const { getUsuarios, postUsuario, putUsuarios, deleteUsuario } = require('../controllers/usuarios');

//Middlewares
const { validacionToken, validarRole, validarCampos } = require('../middlewares');
//Helpers
const { usuarioExiste, emailVeirfy, carrerasValidacion } = require('../helpers/db-validaciones');

//Rutas
router.get('/', [
    validacionToken,
    validarRole,
],getUsuarios);

router.post('/',[
    validacionToken,
    validarRole,
    check('nombre', 'El nombre no puede ir vacio').notEmpty(),
    check('apellidos', 'Los apellidos no pueden ir vacios').notEmpty(),
    check('email', 'El email no puede ir vacio').notEmpty(),
    check('email', 'Este no es un email valido, verifiquelo porfavor').isEmail(),
    check('numeroC').custom(usuarioExiste),
    check('email').custom(emailVeirfy),
    check('carrera').custom(carrerasValidacion),
    validarCampos
],postUsuario);


router.put('/:id', [
    validacionToken,
    validarRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(usuarioExiste),
    validarCampos
],putUsuarios);


router.delete('/:id', [
    validacionToken,
    validarRole,
],deleteUsuario)



//Exportando el router
module.exports = router;