const {response}  = require('express');


const validarRole = (req, res = response, next) => {

    if(!req.userAuntenticated){
        return res.status(500).json({
            ok: false,
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    };

    const role = req.type;
    
    if(role != 'ADMINISTRADOR') {
        return res.status(401).json({
            ok: false,
            msg: `EL usuario ${req.userAuntenticated.nombre} no tiene permisos como administrador`
        });
    }

    
    next()

}

module.exports ={validarRole};