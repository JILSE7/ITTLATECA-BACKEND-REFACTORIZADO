const router = require('express').Router();

//Definimos el comportamiento raiz del endpoint

router.get('/',(req,res) =>{
    res.send('Bienvenidos a ITTLATECA, Aqui inicia nuestro backend');
});


//Definimos las rutas a nuestras collecciones
router.use('/auth', require('./auth'));
router.use('/libros', require('./libros')); 
router.use('/usuarios', require('./usuarios'))
router.use('/prestamos', require('./prestamos'))

module.exports = router;