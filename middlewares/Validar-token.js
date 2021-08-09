//Importando jwt
const jwt = require('jsonwebtoken');
const {response}  = require('express');
const { Usuario } = require('../models');

//Model user



const validacionToken = async(req, res = response, next) => {

    const token = req.header('x-token'); //extrayendo el token de la peticion

    //Verificar si viene el token
    if(!token) return res.status(401).json({
        ok: false,
        msg: 'No hay token en la peticion'
    })

    try {
        //Verifica el token, si exites se va al next y si no se salta al catch
        const {uid, numeroC, type} = jwt.verify(token, process.env.JWT_SECRET);
        
        
        req.uid = uid; //creando el uid en la peticion para posteriormente ocuparlo
        req.numeroC = numeroC;
        req.type = type;

        const userAuntenticated = await Usuario.findById(uid);
        

        if(!userAuntenticated){
            return res.status(401).json({
                ok: false,
                msg: 'Token no valido - Usuario inexistente'
            });
        } 


        if(!userAuntenticated.activo){
            return res.status(401).json({
                ok: false,
                msg: 'Token no valido - Usuario Inactivo'
            });
        }
        req.userAuntenticated = userAuntenticated;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok:false,
            msg: 'Token no valido'
        })
    }

}


module.exports = {validacionToken}