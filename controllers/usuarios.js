const {response} = require('express');
//Modelos
const { Usuario } = require('../models');
//Encriptador de contraseñas
const bcrypt = require('bcrypt');


const getUsuarios = async(req, res = response) => {
    try {
        const [usuarios, total] = await Promise.all([
            Usuario.find()
                                    .populate({path: "prestamos", select: "libro observaciones fechaRetiro fechaDevolucion devolucion", populate:{path: 'libro', select: 'nombre'}}),

                                    //.populate({path: 'comments', populate:{path: 'user', select:'_id userName profilePhoto' ,model: 'User'}}),
            Usuario.countDocuments()
        ]);

        res.json({
            ok: true,
            total,
            usuarios,
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar a los usuarios'
        })
    };
};



const postUsuario = async(req, res = response) => {
    const {password, ...usuario} = req.body;
    try {

        //Creando a nuestro usuario
        const newUsuario = new Usuario({...usuario, password});
        //Encriptar la contraseña
        const salt = bcrypt.genSaltSync(); //10 default
        newUsuario.password = bcrypt.hashSync(password, salt);
        //Guardando en BD password encriptada
        await newUsuario.save();

        res.status(201).json({
            ok:true,
            usuario: newUsuario
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Erro al grabar en BD, intentelo de nuevo, si el problema persiste contacte al admin'
        });
    };

};


const putUsuarios = async(req, res = response) => {
    const {id} = req.params;
    const {password, ...userPut} = req.body;

    try {
        if(password) {
            //Encriptar la contraseña
            const salt = bcrypt.genSaltSync(); //10 default
            userPut.password = bcrypt.hashSync(password, salt);
       };
        const user = await Usuario.findByIdAndUpdate(id, {...userPut}, {new : true, useFindAndModify: false});
        res.status(200).json({
            ok:true,
            usuario: user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar usuarios'
        });
    };
};


const toogleConexion = async(req, res = response) => {
    const {id} = req.params;
    const {activo} = req.body;
    try {
        //Cambiar el estado a false, para no producir conflitos con relaciones
        const usuario = await Usuario.findByIdAndUpdate(id, {activo}, {new: true});
        return res.status(200).json({
            ok: true,
            msg: `usuario ${usuario.nombre} ha sido ${activo ? 'Activado' : 'Desactivado'}`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Error al eliminar al usuario'
        })
    } 
}


const deleteUsuario = async(req, res =response) => {
    const {id}= req.params
    
    try {//Para eliminar un usuario, tenemos que estar seguros que no tenga ninguna devolucion pendiente
    
        await Usuario.findByIdAndDelete(id);

        return res.status(200).json({
            ok: true,
            msg: `Eliminado con exito`
        })

    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg: 'Erro al intertar borrar al usuario de la base'
        })        
    }
}


module.exports = {
    getUsuarios,
    postUsuario,
    putUsuarios,
    toogleConexion,
    deleteUsuario
}