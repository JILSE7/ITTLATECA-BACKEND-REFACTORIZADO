const {response} = require('express');
const {validationResult} = require('express-validator');


const validarCampos = (req, res=response, next) => {
    //Manejo de errores
    const errors = validationResult(req);
    console.log(errors);
    //si existen errores
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()//retorna todos los errores que encuentre
        })
    };

    next();
};


module.exports = {validarCampos};