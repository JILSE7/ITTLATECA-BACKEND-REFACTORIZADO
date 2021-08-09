const {response} = require('express');

//Modelo usuarios


//bcryp para comparacion de contraseñas
const bcrypt = require('bcrypt');
const tokenGenerador = require('../helpers/tokenGenerador');
const { generateUser } = require('../helpers/helpers');

//Generador de tokens



//Login de usuario
const login = async(req, res = response) => {
    //Extraemos la info de la peticion
    const {numeroC, password} = req.body; 
    const {password: userPassword, type, prestamos, nombre, apellidos, email, activo,_id:uid, carrera, telefono} = req.usuario; //extraemos el password de el usuario que se trata de autenticar
    const user = generateUser(nombre, apellidos, email, telefono , numeroC, carrera, type, activo, prestamos, uid);
        
    try {
        //1.- Ya paso por nuestra validacion del middleware, estamos seguros que el usuario existe y esta actvo
        //2.- Verificamos la contraseña
        const validatePass = bcrypt.compareSync(password, userPassword) //comparando la contraseña de la req vs bd
        if(!validatePass){//contraseña incorrecta
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta, verifiquela porFavor'
            })
        }

        //3.- Generamos el token
      const token = await tokenGenerador(uid, numeroC, type);

        res.json({
            ok: true,
            token,
            user
        });
        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al tratar de iniciar secion, contacte al administrador'
        });
    };

};


const renovarToken = async(req, res = response) => {
    const user = req.userAuntenticated;
    console.log(user);
    // Generar el JWT
    const token = await tokenGenerador(user._id);

    return res.json({
        ok:true,
        user,
        token
    });
};





module.exports = {
    login,
    renovarToken
}