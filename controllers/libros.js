const {response} = require('express');
//Modelos
const { Libro } = require("../models");
//Mongoose
//extrayendo funciones para validar id
const {ObjectId} = require('mongoose').Types;

//Cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
//Helpers
const {validarImagen, extraerIdImagen, uploadImage} = require('../helpers/uploadFile')



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
    //const libro = req;
    console.log(req.files);
    console.log(JSON.parse(req.body.libro));
    try {
        const newLibro = new Libro(JSON.parse(req.body.libro));

        if(req.files){
            console.log('existe el archivo');
            const {secure_url} = await cloudinary.uploader.upload(req.files.bookIMage.tempFilePath);
            newLibro.imagen = secure_url;
        };

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
    const {imagen,...libroPut}= JSON.parse(req.body.libro);
    const newImage = req.files?.bookIMage;
 
     try {

        if(newImage){
            console.log('Significa que tenemos que remover la imagen, eliminarla de cloudinary y volver a ponerla al modelo');
            const {ok, extension} = validarImagen(newImage.name); //Validar que el archivo sea una imagen           
            if(ok){
                if(imagen.includes('cloudinary')){
                    const idImagen = extraerIdImagen(imagen); //Extraermos el id de la imagen
                    await cloudinary.uploader.destroy(idImagen); // Destruimos la iimagen
                    const {secure_url} = await cloudinary.uploader.upload(newImage.tempFilePath);
                    libroPut.imagen = secure_url;
                }else{
                    console.log('subir la imagen a cloudinary poque esta en otro lado');
                    const url = await uploadImage(newImage.tempFilePath)
                    libroPut.imagen = url;
                }
            }else{
                console.log('caifo aqui');
                return res.status(400).json({
                    ok:false,
                    msg: `Archivo no valido .${extension} no permitido, solo se permite png,jpg,jpeg`
                })
            }
        }

        const libro = await Libro.findByIdAndUpdate(id, {...libroPut}, {new : true});
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


const unableLibro = async(req, res = response) => {
    const {id} = req.params;
    const {activo} = req.body
    
    try {
        //Cambiar el estado a false, para no producir conflitos con relaciones
        const libro = await Libro.findByIdAndUpdate(id, {activo}, {new: true});
        return res.status(200).json({
            ok: true,
            msg: `El libro ${libro.nombre} ha sido ${activo ? 'activado': 'desactivado'}`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Error al eliminar el libro'
        })
    }
}

const deleteLibro = async(req, res = response) => {
    const {id} = req.params;
    try {
        const libro = await Libro.findByIdAndDelete(id);

        return res.status(200).json({
            ok: true,
            msg: `El libro ${libro.nombre} ha sido eliminado de la base de datos`
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
    deleteLibro,
    unableLibro
}