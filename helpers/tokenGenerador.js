const jwt = require('jsonwebtoken');

//Generando el token
const tokenGenerador = (uid = '', numeroC = '', type = '') => {
    return new Promise((resolve, reject) => {
        //Lo que queremos que traiga el token
        const payload = {uid, numeroC, type};
        //Firmando el token
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '2h'
        }, (err, token) => {
            if(err){
                //Si existe un error al momento de generar el token
                console.log(err);
                reject('No se pudo generar el token');
            }else{
                //Regresamos el token si todo sale bien
                resolve(token);
            }
        })
    }) 
}

module.exports = tokenGenerador;