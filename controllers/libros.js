const {response} = require('express');
//Modelos
const { Libro } = require("../models");
//Mongoose
//extrayendo funciones para validar id
const {ObjectId} = require('mongoose').Types;


const getLibros = async(req, res = response) => {
    try {
        const [libros, total] = await Promise.all([
            Libro.find()
                                    .populate("prestamos", "fechaRetiro fechaDevolucion devolucion"),
            Libro.countDocuments()
        ]);

        res.json({
            ok: true,
            total,
            libros,
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar a los usuarios'
        });
    };
};



const getLibro = async(req, res = response) => {
    const {search} = req.params;

    try {
        const isMongoId = ObjectId.isValid(search); // si es un id de mongo regresa un true
    
        if( isMongoId){
            const libro = await Libro.findById(search);
            return res.json({
                ok: true,
                results: (libro) ?  [libro] : []
            });
        };

        //expresion regular
        const regex =  new RegExp(search, 'i' );  // la i indica que no es case sensitive, 
        const libros = await Libro.find({ //con el or podemos flexibilazar la busqueda a mas campos si la que esta antes no se cumple
            $or: [{nombre: regex}, {autor:regex},{categoria: regex}],
            //$and : [{state:true}] y que cumpla esta condicion, si son false no las trae
        }); // trae todos los que coincidan con el
    
        res.json({
            ok: true,
            results: libros
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al buscar el libro, intentelo de nuevo'
        });
    };

    
};


const postLibro = async(req, res=response) => {
    const libro = req.body;
    try {
        const newLibro = new Libro(libro);
        //Guardadndo en BD
        await newLibro.save();
        //Enviando respuesta
        return res.status(200).json({
            ok: true,
            libro: newLibro
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Error al crear el libro'
        });
    };
    
};

const putLibro = async(req, res = response) => {
    const {id} = req.params;
    const libroPut= req.body;
    try {
        const libro = await Libro.findByIdAndUpdate(id, {...libroPut}, {new : true, useFindAndModify: false});
        res.status(200).json({
            ok:true,
            Libro: libro
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el libro, si el problema persiste comuniquese con el administrador'
        });
    }

};


const deleteLibro = async(req, res = response) => {
    const {id} = req.params;
    try {
        //Cambiar el estado a false, para no producir conflitos con relaciones
        const libro = await Libro.findByIdAndUpdate(id, {activo: false}, {new: true, useFindAndModify: false});
        return res.status(200).json({
            ok: true,
            libro
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Error al eliminar el libro'
        })
    }
}


module.exports = {
    getLibros,
    getLibro,
    postLibro,
    putLibro,
    deleteLibro
}