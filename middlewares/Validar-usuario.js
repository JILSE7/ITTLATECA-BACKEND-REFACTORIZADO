const {response} = require('express');
const { Usuario } = require('../models');

const usuarioVerificacionLogin = async(req, res = response, next) => {
    const {numeroC} = req.body //extraemos el numeroC de la peticion

    try {//Buscando al usuario
        const userExist = await Usuario.find({numeroC});
        
        //si no existe
        if(userExist.length === 0){
            return res.status(400).json({
                ok:false,
                msg: `El usuario con el numero de control ${numeroC} no existe en la base, verifiquelo porfavor`
            })
        }
        if(!userExist[0].activo){//si existe pero esta inactivo
            return res.status(400).json({
                ok: false,
                msg: `El usuario ${numeroC} esta inactivo`
            })
        }
        //Si todo sale bien
            req.usuario = userExist[0]; //guardamos al usuario en la peticion
            next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al validar al usuario [middleware]'
        })
    }
}


module.exports = {usuarioVerificacionLogin};