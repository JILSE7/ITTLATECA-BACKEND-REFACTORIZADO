
const router =require('express').Router();
const { check } = require('express-validator');


//Controladores
const { getLibros, postLibro, getLibro, putLibro, deleteLibro, unableLibro } = require('../controllers/libros');
const { libroValidacion } = require('../helpers/db-validaciones');

//Middlewares
const {validacionToken, validarRole, validarCampos} = require('../middlewares');



//Middlewares


router.get('/', [
    validacionToken
],getLibros);

router.get('/:search', validacionToken,getLibro);


router.post('/', [
    validacionToken,
    validarRole,
    check('nombre', 'El campo "nombre" esta vacio').notEmpty(),
    check('autor','El campo "autor" esta vacio').notEmpty(),
    check('editorial', 'El campo "editorial" esta vacio').notEmpty(),
    check('edicion', 'El campo "edicion" esta vacio').notEmpty(),
    check('categoria', 'El campo "categoria" esta vacio').notEmpty(),
    check('existencias', 'El campo "existencias" esta vacio').notEmpty(),
    check('disponibles', 'El campo "disponibles" esta vacio').notEmpty(),
    check('ubicacion', 'El campo "ubicacion" esta vacio').notEmpty(),
    validarCampos
],postLibro);

router.put('/:id', [
    validacionToken,
    validarRole,
    check('id', 'id invalido, verifquelo porfavor').isMongoId(),
    validarCampos
],putLibro);

router.put('/unable/:id', [
    validacionToken,
    validarRole,
    check('id', 'id invalido, verifquelo porfavor').isMongoId(),
    validarCampos
],unableLibro);

router.delete('/:id',[
    validacionToken,
    validarRole,
    check('id', 'id invalido, verifquelo porfavor').isMongoId(),
    validarCampos
] ,deleteLibro);

//Exportando el router
module.exports = router;