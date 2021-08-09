//Definiendo nuestro esquema de usuarios;
const {Schema, model} = require('mongoose');


const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos son obligatorio']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    telefono: {
        type: String,
        required: true
    },
    numeroC:{
        type: String,
        required: true,
        unique: true
    },
    carrera: {
        type: String,
        required: true,
        enum: ['INDUSTRIAL', 'ELECTRICA', 'ELECTROMECANICA', 'GE', 'TICS', 'MECANICA', 'MECATRONICA', 'DOCENTE', 'OTRO']
    },
    type: {
        type: String,
        enum: ['USUARIO', "ADMINISTRADOR"],
        required: true,
        default: 'USUARIO'
    },
    activo: {
        type: Boolean,
        required:true,
        default: true
    },
    prestamos:{
        type: [Schema.Types.ObjectId],
        ref: 'Prestamo',
        default: []
    }
})

//Editandop el schema
//Quitando __v & password
usuarioSchema.methods.toJSON = function ( ) {
    const {__v , password,_id, ...user } = this.toObject();
    user.uid = _id;
    return user;    
}

//exportando el modelo
module.exports = model('Usuario', usuarioSchema)