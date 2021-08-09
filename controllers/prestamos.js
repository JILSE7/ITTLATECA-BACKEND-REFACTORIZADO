const {response} = require('express');
const { nuevoPrestamo, actualizarPrestamo } = require('../helpers/prestamos');
const { Prestamo } = require('../models');


const getPrestamos =async (req, res = response) => {

    const [prestamos, total] = await Promise.all([
        Prestamo.find()
                                        .populate('usuario userAdmin', '_id type nombre apellidos email numeroC')
                                        .populate('libro'),
        Prestamo.countDocuments()
    ]);

    res.status(200).json({
        ok: true,
        total,
        prestamos
    })

};


const postPrestamo = async(req, res= response) => {
    const {usuario, libro,...rest} = req.body;
    const {_id:adminId} = req.userAuntenticated;
    try {
        const prestamo = await nuevoPrestamo(usuario, adminId,libro,rest);
        return res.status(200).json({
            ok: true,
            prestamo
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: error
        })
    };
};


const putPrestamo = (req, res = response) => {

    const {prestamo} = req.params;
    const body = req.body

    actualizarPrestamo(res, prestamo, body);

};


const borrarPrestamo = async(req, res=response) => {
    const {prestamo: id} = req.params;
    try {
        //Cambiar el estado a false, para no producir conflitos con relaciones
        const prestamo = await Prestamo.findByIdAndUpdate(id, {activo: false}, {new: true, useFindAndModify: false});
        return res.status(200).json({
            ok: true,
            prestamo
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Error al eliminar el prestamo'
        })
    }
}


module.exports = {
    getPrestamos,
    postPrestamo,
    putPrestamo,
    borrarPrestamo
}