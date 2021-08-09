const { Usuario, Libro } = require("../models");
//Mongoose
const {ObjectId} = require('mongoose').Types;

const checkCarreras = ['INDUSTRIAL', 'ELECTRICA', 'ELECTROMECANICA', 'GE', 'TICS', 'MECANICA', 'MECATRONICA', 'DOCENTE', 'OTRO'];


const usuarioExiste = async(search) => {
    if(ObjectId.isValid(search)){
        const userExist = await Usuario.findById(search);
        if(!userExist){
            throw new Error(`El usuario con el id ${search} no esta dado de alta en la base de datos`)
        };

    }else{
        const userExist = await Usuario.find({numeroC: search});
        if(userExist[0]){
            throw new Error(`El usuario con el numero de control ${search} ya esta dado de alta en la base de datos`)
        };

    }
};


const emailVeirfy = async(email) => {
        const emailExiste = await Usuario.find({email});
        if(emailExiste[0]){
            throw new Error(`Este correo ya esta registrado en la base de datos ${email} intente con otro email`);
        };
};

const carrerasValidacion = (carrera) => {
    console.log(carrera);
    console.log(checkCarreras.includes(carrera))
    if(!checkCarreras.includes(carrera)){
        throw new Error(`Esta Carrera no esta registrada, ${carrera}`);
    };

    return true;
}


const libroValidacion = async(libro) => {
    
        const regex =  new RegExp(libro, 'i' );
        const libroExiste = await Libro.find({nombre: regex});
        if(libroExiste[0]){
            throw new Error(`El libro ${libro} ya esta registrado en la base de datos`);
        };
    return true;
}

module.exports = {
    usuarioExiste,
    emailVeirfy,
    carrerasValidacion,
    libroValidacion
}


